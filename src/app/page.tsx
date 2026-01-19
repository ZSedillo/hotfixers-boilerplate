import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import Navbar from "@/components/navbar";

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*").neq("stock", 0);
  
  // Note: We don't fetch user here anymore
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* <--- FIXED: No props passed */}
      
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Latest Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}