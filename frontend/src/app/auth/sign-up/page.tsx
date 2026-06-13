import Link from 'next/link';
import { signUpWithEmail } from './actions';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form action={signUpWithEmail} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-3xl font-bold">Create account</h1>

        {params.error ? (
          <p className="text-red-400">Could not create account. Try again.</p>
        ) : null}

        <input
          className="rounded border border-gray-700 bg-transparent p-3"
          name="name"
          placeholder="Name"
          required
        />

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
          Sign up
        </button>

        <Link className="underline" href="/auth/sign-in">
          Already have an account? Sign in
        </Link>
      </form>
    </main>
  );
}
