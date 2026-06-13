import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { createTask } from './actions';
import Link from 'next/link';

type Task = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export const dynamic = 'force-dynamic';

async function getTasks(userId: string) {
  const response = await fetch(
    `http://localhost:4000/tasks?user_id=${encodeURIComponent(userId)}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json() as Promise<Task[]>;
}

export default async function TasksPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.email) {
    redirect('/auth/sign-in');
  }

  const tasks = await getTasks(session.user.email);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <Link className="text-sm underline" href="/">
            Back home
          </Link>

          <h1 className="mt-4 text-5xl font-bold">Rust Tasks</h1>

          <p className="mt-3 text-lg text-gray-400">
            Logged in as {session.user.email}
          </p>
        </div>

        <form action={createTask} className="mb-8 flex gap-3">
          <input
            className="flex-1 rounded border border-gray-700 bg-transparent p-4 text-lg"
            name="title"
            placeholder="Add a new task"
            required
          />

          <button className="rounded bg-white px-8 py-4 text-lg text-black">
            Add
          </button>
        </form>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-400">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="rounded border border-gray-700 p-5"
              >
                <p className="text-xl font-bold">{task.title}</p>

                <p className="mt-2 text-sm text-gray-500">
                  Created at {new Date(task.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}