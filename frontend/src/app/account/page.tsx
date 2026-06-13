import { auth } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const { data: session } = await auth.getSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Protected account page</h1>

      <p>This page is protected by Neon Auth.</p>

      <div className="w-full max-w-xl rounded border border-gray-700 p-4">
        <p className="mb-2 font-bold">Current user:</p>

        <pre className="overflow-auto rounded bg-gray-900 p-4 text-sm">
          {JSON.stringify(session?.user, null, 2)}
        </pre>
      </div>
    </main>
  );
}
