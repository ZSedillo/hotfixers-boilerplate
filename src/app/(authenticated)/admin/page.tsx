import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Pencil, Trash2, PackageSearch } from "lucide-react";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"; // We will create this

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Security Check (Use the utility we made earlier for better safety)
  if (!user || user.email !== "admin123@gmail.com") {
    return redirect("/");
  }

  // FETCH REAL DATA FROM DB
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/products/new">+ Add Product</Link>
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Products</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{products?.length || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Out of Stock</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{products?.filter(p => p.stock === 0).length || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Low Stock (&lt;10)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-500">{products?.filter(p => p.stock > 0 && p.stock < 10).length || 0}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Product Management</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-gray-500">Image</th>
                  <th className="p-4 font-medium text-gray-500">Product Name</th>
                  <th className="p-4 font-medium text-gray-500">Price</th>
                  <th className="p-4 font-medium text-gray-500">Stock</th>
                  <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400">
                      <PackageSearch className="mx-auto mb-2 opacity-20" size={48} />
                      No products found in database.
                    </td>
                  </tr>
                ) : (
                  products?.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50/50">
                      <td className="p-4">
                        <img 
                          src={product.image_url || "https://placehold.co/100"} 
                          className="h-10 w-10 object-cover rounded border" 
                          alt="" 
                        />
                      </td>
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4">${product.price.toFixed(2)}</td>
                      <td className="p-4">
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/admin/products/${product.id}`}>
                              <Pencil size={16} />
                            </Link>
                          </Button>
                          
                          {/* DELETE MODAL TRIGGER */}
                          <DeleteConfirmModal productId={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}