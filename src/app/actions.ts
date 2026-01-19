"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signout() {
  const supabase = await createClient();
  
  // 1. Log out from Supabase
  await supabase.auth.signOut();

  // 2. Clear any cached data so the next user doesn't see it
  revalidatePath("/", "layout");

  // 3. Kick them back to Login
  redirect("/login");
}