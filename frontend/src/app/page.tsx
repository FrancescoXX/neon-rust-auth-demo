import { auth } from '@/lib/auth/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function signOut() {
  'use server';

  await auth.signOut();
  redirect('/');
}

export default async function Home() {
  const { data: session } = await auth.getSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Neon Rust Auth Demo</h1>

      {session?.user ? (
        <div className="flex flex-col items-center gap-4">
          <p>
            Logged in as{' '}
            <span className="font-bold">
              {session.user.name || session.user.email}
            </span>
          </p>

          <Link className="underline" href="/account">
            Go to protected account page
          </Link>

          <Link className="underline" href="/tasks">
            Open Rust Tasks
          </Link>

          <form action={signOut}>
            <button className="rounded bg-white px-4 py-2 text-black">
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p>You are not logged in.</p>

          <div className="flex gap-4">
            <Link className="underline" href="/auth/sign-up">
              Sign up
            </Link>

            <Link className="underline" href="/auth/sign-in">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}