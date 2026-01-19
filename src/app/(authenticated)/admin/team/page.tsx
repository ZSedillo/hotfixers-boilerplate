import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- ACTION 1: Add Admin by Email ---
async function addAdminByEmail(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const currentUserRole = await getUserRole();
  if (currentUserRole !== "head_admin") return;

  // Find user by email
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (error || !profile) {
    console.error("User not found");
    return;
  }

  // Update role to admin
  await supabase.from("profiles").update({ role: "admin" }).eq("id", profile.id);
  revalidatePath("/admin/team");
}

// --- ACTION 2: Demote Admin ---
async function removeAdmin(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const targetUserId = formData.get("userId") as string;

  const currentUserRole = await getUserRole();
  if (currentUserRole !== "head_admin") return;

  // Downgrade back to 'user'
  await supabase.from("profiles").update({ role: "user" }).eq("id", targetUserId);
  revalidatePath("/admin/team");
}

export default async function ManageTeamPage() {
  const supabase = await createClient();
  const role = await getUserRole();

  if (role !== "head_admin") {
    return redirect("/admin");
  }

  // --- FILTERED QUERY: Only fetch Admin and Head Admin ---
  const { data: adminTeam } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "head_admin"]) // <--- This hides normal users!
    .order("role");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* SECTION 1: ADD NEW ADMIN */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Add New Admin</CardTitle>
          <CardDescription className="text-blue-700">
            Enter the email of an existing user to promote them to the Admin Team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addAdminByEmail} className="flex gap-4">
            <Input 
              name="email" 
              placeholder="staff@example.com" 
              required 
              type="email" 
              className="bg-white"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
              Promote to Admin
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* SECTION 2: THE ADMIN LIST */}
      <div>
        <h2 className="text-xl font-bold mb-4">Current Admin Team</h2>
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-500">Email</th>
                <th className="p-4 font-medium text-gray-500">Role</th>
                <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* If list is empty (besides you), show a message */}
              {adminTeam?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">No admins found.</td>
                </tr>
              ) : (
                adminTeam?.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="p-4 font-medium">{user.email}</td>
                    <td className="p-4">
                      <Badge className={
                        user.role === 'head_admin' ? 'bg-red-600' : 'bg-blue-600'
                      }>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      {/* You can only remove admins, not yourself/other head admins */}
                      {user.role !== "head_admin" && (
                        <form action={removeAdmin}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            Remove
                          </Button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}