# neon-rust-auth-demo

A small full-stack demo using:

* Next.js for the frontend
* Neon Auth for authentication
* Rust with Axum for the backend API
* Neon Postgres for the database
* Neon Branching to test database changes safely

The app lets users sign up, sign in, view a protected page, and create personal tasks. Tasks are stored in Neon Postgres through the Rust backend.

## Project structure

```txt
neon-rust-auth-demo/
  frontend/
    Next.js app with Neon Auth
  backend/
    Rust Axum API connected to Neon Postgres
```

## Requirements

You need:

```txt
Node.js
npm
Rust
A Neon project with Neon Auth enabled
A Neon Postgres connection string
```

## Environment variables

Create this file for the frontend:

```txt
frontend/.env.local
```

Use this structure:

```env
NEON_AUTH_BASE_URL=
NEON_AUTH_COOKIE_SECRET=
DATABASE_URL=
```

Create this file for the backend:

```txt
backend/.env
```

Use this structure:

```env
DATABASE_URL=
```

Example files are included:

```txt
frontend/.env.example
backend/.env.example
```

## Run the backend

From the project root:

```bash
cd backend
cargo run
```

The Rust API runs on:

```txt
http://localhost:4000
```

Useful endpoints:

```txt
GET  /health
GET  /tasks
GET  /tasks?user_id=user@example.com
POST /tasks
```

## Run the frontend

Open another terminal.

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```txt
http://localhost:3000
```

If port 3000 is busy, Next.js may use:

```txt
http://localhost:3001
```

## Demo flow

1. Open the frontend.
2. Sign up with email and password.
3. Open the protected account page.
4. Open the tasks page.
5. Create a task.
6. The frontend sends the authenticated user email to the Rust backend.
7. The Rust backend stores and reads tasks from Neon Postgres.

## Neon Branching demo

To test Neon database branching:

1. Create a new branch in the Neon dashboard.
2. Choose `Branch data and schema`.
3. Copy the branch connection string.
4. Create a backend preview env file:

```txt
backend/.env.preview
```

5. Add the preview branch connection string:

```env
DATABASE_URL=
```

6. Run the backend using the preview branch:

```bash
cd backend
set -a
source .env.preview
set +a
cargo run
```

Now any task created through the API is written to the preview branch.

To switch back to production:

```bash
cd backend
set -a
source .env
set +a
cargo run
```

The task created in the preview branch should not appear in production.

## Notes

This is a demo project. The goal is to show how Neon Auth, Neon Postgres, Neon Branching, Next.js, and Rust can work together in a simple full-stack application.
