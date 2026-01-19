import { updatePassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">New Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            {message && (
              <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md border border-red-200">
                {message}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <Button formAction={updatePassword} className="w-full mt-2">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}