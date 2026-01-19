import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* <--- FIXED: No props passed */}
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">My Order History</h1>
        {/* ... rest of your code ... */}
        <div className="space-y-4">
          {orders?.map((order) => (
             // ... keep your existing order loop code ...
             <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border">
                Order #{order.id.slice(0,8)} - <Badge>{order.status}</Badge>
             </div>
          ))}
        </div>
      </main>
    </div>
  );
}