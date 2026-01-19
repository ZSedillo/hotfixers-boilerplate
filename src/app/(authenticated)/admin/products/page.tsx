import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/products/new">+ Add New Product</Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 w-[100px]">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                    {/* Using a standard img tag to avoid Next.js Image complexity for now */}
                    <img 
                      src={product.image_url || "https://placehold.co/100"} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock} in stock
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}