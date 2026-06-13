use axum::{
    extract::{Query, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, FromRow, PgPool};
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    db: PgPool,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
}

#[derive(Serialize, FromRow)]
struct Task {
    id: Uuid,
    user_id: String,
    title: String,
    completed: bool,
    created_at: DateTime<Utc>,
}

#[derive(Deserialize)]
struct CreateTaskRequest {
    user_id: String,
    title: String,
}

#[derive(Deserialize)]
struct ListTasksQuery {
    user_id: Option<String>,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let db = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to Neon Postgres");

    create_tables(&db).await;

    let state = AppState { db };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        .route("/tasks", get(list_tasks).post(create_task))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000")
        .await
        .expect("Failed to bind to port 4000");

    println!("Rust API running on http://localhost:4000");

    axum::serve(listener, app)
        .await
        .expect("Server failed");
}

async fn create_tables(db: &PgPool) {
    sqlx::query(
        r#"
        create table if not exists tasks (
            id uuid primary key default gen_random_uuid(),
            user_id text not null,
            title text not null,
            completed boolean not null default false,
            created_at timestamptz not null default now()
        );
        "#,
    )
    .execute(db)
    .await
    .expect("Failed to create tasks table");
}

async fn root() -> &'static str {
    "Neon Rust Auth Demo API"
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        service: "rust-axum-api".to_string(),
    })
}

async fn list_tasks(
    State(state): State<AppState>,
    Query(query): Query<ListTasksQuery>,
) -> Result<Json<Vec<Task>>, (StatusCode, String)> {
    let tasks = match query.user_id {
        Some(user_id) => {
            sqlx::query_as::<_, Task>(
                r#"
                select id, user_id, title, completed, created_at
                from tasks
                where user_id = $1
                order by created_at desc
                "#,
            )
            .bind(user_id)
            .fetch_all(&state.db)
            .await
        }
        None => {
            sqlx::query_as::<_, Task>(
                r#"
                select id, user_id, title, completed, created_at
                from tasks
                order by created_at desc
                "#,
            )
            .fetch_all(&state.db)
            .await
        }
    }
    .map_err(|error| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to list tasks: {error}"),
        )
    })?;

    Ok(Json(tasks))
}

async fn create_task(
    State(state): State<AppState>,
    Json(payload): Json<CreateTaskRequest>,
) -> Result<Json<Task>, (StatusCode, String)> {
    let task = sqlx::query_as::<_, Task>(
        r#"
        insert into tasks (user_id, title)
        values ($1, $2)
        returning id, user_id, title, completed, created_at
        "#,
    )
    .bind(payload.user_id)
    .bind(payload.title)
    .fetch_one(&state.db)
    .await
    .map_err(|error| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to create task: {error}"),
        )
    })?;

    Ok(Json(task))
}