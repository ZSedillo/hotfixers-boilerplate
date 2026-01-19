import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Security Check
  if (!user || user.email !== "admin123@gmail.com") {
    return redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
           <Button variant="outline">Export Data</Button>
           <Button className="bg-blue-600 hover:bg-blue-700">+ Add Product</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">$45,231.89</div></CardContent>
        </Card>
        <Card>
           <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Active Orders</CardTitle></CardHeader>
           <CardContent><div className="text-2xl font-bold">126</div></CardContent>
        </Card>
        <Card>
           <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle></CardHeader>
           <CardContent><div className="text-2xl font-bold text-red-600">4</div></CardContent>
        </Card>
      </div>

      {/* Product Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-gray-500">Product Name</th>
                  <th className="p-4 font-medium text-gray-500">Status</th>
                  <th className="p-4 font-medium text-gray-500">Price</th>
                  <th className="p-4 font-medium text-gray-500">Stock</th>
                  <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock Data Row 1 */}
                <tr className="border-b">
                  <td className="p-4 font-medium">Wireless Headphones Pro</td>
                  <td className="p-4"><Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Input className="h-8 w-24" defaultValue="199.99" />
                    </div>
                  </td>
                  <td className="p-4">450</td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="ghost">Edit</Button>
                  </td>
                </tr>
                 {/* Mock Data Row 2 */}
                 <tr className="border-b">
                  <td className="p-4 font-medium">Gaming Mouse X1</td>
                  <td className="p-4"><Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Low Stock</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Input className="h-8 w-24" defaultValue="59.00" />
                    </div>
                  </td>
                  <td className="p-4 text-red-600 font-bold">12</td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="ghost">Edit</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}