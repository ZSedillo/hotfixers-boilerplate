"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = "http://localhost:3000"; 

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    // FIX: Log it to console AND send the real message to the UI
    console.error("Reset Password Error:", error.message);
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?message=Check your email for the reset link");
}