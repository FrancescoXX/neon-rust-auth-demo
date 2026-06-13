'use server';

import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTask(formData: FormData) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  const title = formData.get('title') as string;

  if (!title) {
    return;
  }

  await fetch('http://localhost:4000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: session.user.email,
      title,
    }),
  });

  revalidatePath('/tasks');
}
