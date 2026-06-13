import Link from 'next/link';
import { signInWithEmail } from './actions';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form action={signInWithEmail} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-3xl font-bold">Sign in</h1>

        {params.error ? (
          <p className="text-red-400">Could not sign in. Try again.</p>
        ) : null}

        <input
          className="rounded border border-gray-700 bg-transparent p-3"
          name="email"
          placeholder="Email"
          type="email"
          required
        />

        <input
          className="rounded border border-gray-700 bg-transparent p-3"
          name="password"
          placeholder="Password"
          type="password"
          required
        />

        <button className="rounded bg-white p-3 text-black">
          Sign in
        </button>

        <Link className="underline" href="/auth/sign-up">
          Need an account? Sign up
        </Link>
      </form>
    </main>
  );
}
