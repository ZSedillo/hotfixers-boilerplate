import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Global Auth Check for this entire group
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. If no user, kick to login
  if (!user) {
    redirect("/login");
  }

  // 3. If user exists, render the Navbar + The Page Content
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user.email} />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}