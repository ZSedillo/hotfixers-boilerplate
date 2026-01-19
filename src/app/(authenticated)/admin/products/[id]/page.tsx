import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

async function updateProduct(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const existingImageUrl = formData.get("existingImageUrl") as string;
  const imageFile = formData.get("image") as File;
  
  let publicUrl = existingImageUrl;

  // Check if a new image was actually uploaded
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);

    if (!error) {
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      publicUrl = urlData.publicUrl;
    }
  }

  const updates = {
    name: formData.get("name") as string,
    price: parseFloat(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string),
    description: formData.get("description") as string,
    image_url: publicUrl, // Save the new URL or keep the old one
  };

  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (!error) redirect("/admin");
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader><CardTitle>Edit Product</CardTitle></CardHeader>
        <CardContent>
          <form action={updateProduct} className="grid gap-6">
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="existingImageUrl" value={product.image_url} />
            
            {/* Current Image Preview */}
            <div className="grid gap-2">
              <Label>Current Image</Label>
              <div className="h-32 w-32 rounded-lg border overflow-hidden bg-gray-50">
                <img src={product.image_url} className="h-full w-full object-cover" alt="" />
              </div>
            </div>

            {/* Upload New Image */}
            <div className="grid gap-2">
              <Label htmlFor="image">Replace Image (Optional)</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input name="name" defaultValue={product.name} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price ($)</Label>
                <Input name="price" type="number" step="0.01" defaultValue={product.price} required />
              </div>
              <div className="grid gap-2">
                <Label>Stock</Label>
                <Input name="stock" type="number" defaultValue={product.stock} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Input name="description" defaultValue={product.description || ""} />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600">Save Changes</Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/admin">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}