'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 1. Gather data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // 2. Sign In
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // FIX: Send the ACTUAL error message to the frontend
    console.error('Login Error:', error.message)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // 1. Create the user
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // FIX: Send the ACTUAL error message (e.g., "Password too short")
    console.error('Signup Error:', error.message)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  // 2. FORCE Logout (so they have to log in manually)
  await supabase.auth.signOut()

  // 3. Send them back to Login with success message
  revalidatePath('/', 'layout')
  redirect('/login?message=Account created! Please log in.')
}