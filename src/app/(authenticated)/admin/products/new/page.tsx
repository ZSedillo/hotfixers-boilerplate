import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Optional if you have it, or use plain label

async function addProduct(formData: FormData) {
  "use server";
  const supabase = await createClient();
  
  const imageFile = formData.get("image") as File;
  let publicUrl = "https://placehold.co/600x400/png"; 

  if (imageFile && imageFile.size > 0) {
    // FIX: Sanitize the filename to remove spaces/special chars
    const fileExt = imageFile.name.split('.').pop();
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase
      .storage
      .from("product-images")
      .upload(cleanFileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      // We continue, but the image will be the placeholder so the product still saves
    } else {
      const { data } = supabase
        .storage
        .from("product-images")
        .getPublicUrl(cleanFileName);
      
      publicUrl = data.publicUrl;
    }
  }

  // 4. Save Product to DB with the real Image URL
  const product = {
    name: formData.get("name") as string,
    price: parseFloat(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string),
    description: formData.get("description") as string,
    image_url: publicUrl, 
  };

  await supabase.from("products").insert(product);
  redirect("/admin/products");
}

export default function AddProductPage() {
  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader><CardTitle>Add New Product</CardTitle></CardHeader>
        <CardContent>
          <form action={addProduct} className="grid gap-6">
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input name="name" required placeholder="e.g. Wireless Mouse" />
            </div>

            {/* NEW: Image Upload Input */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Product Image</label>
              <Input 
                name="image" 
                type="file" 
                accept="image/*" // Only allow images
                className="cursor-pointer file:cursor-pointer file:text-blue-600 file:bg-blue-50 file:border-0 file:rounded-md file:px-2 file:mr-4" 
              />
              <p className="text-xs text-gray-500">Supported: JPG, PNG, WEBP</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Price ($)</label>
                <Input name="price" type="number" step="0.01" required placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Stock</label>
                <Input name="stock" type="number" required placeholder="0" />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Input name="description" placeholder="Product details..." />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Product</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}