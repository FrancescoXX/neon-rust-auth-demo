'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  const { error } = await auth.signUp.email({
    email,
    name,
    password,
  });

  if (error) {
    redirect('/auth/sign-up?error=signup_failed');
  }

  redirect('/');
}
