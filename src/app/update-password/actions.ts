"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  // 1. Update the password
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    redirect("/update-password?message=Could not update password");
  }

  // 2. FORCE LOGOUT (Security Best Practice)
  // This ensures they must type the new password to get back in.
  await supabase.auth.signOut();

  // 3. Send them to Login Page with a success message
  revalidatePath("/", "layout");
  redirect("/login?message=Password updated! Please log in.");
}