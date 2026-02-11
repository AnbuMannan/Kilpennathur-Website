"use client";

import { useState } from "react";
import { User, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateUserPassword } from "../settings/actions";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Account Security</h3>
              <p className="text-sm text-muted-foreground">
                Keep your account safe by using a strong password.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Change Password
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Update your login credentials
              </p>
            </div>

            <form 
              action={async (formData) => {
                setSaving(true);
                const result = await updateUserPassword(formData);
                setSaving(false);
                if (result.success) {
                  toast.success("Password updated successfully");
                  (document.getElementById("profile-password-form") as HTMLFormElement)?.reset();
                } else {
                  toast.error(result.error || "Failed to update password");
                }
              }} 
              id="profile-password-form"
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  <Lock className="h-4 w-4 mr-2" />
                  {saving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
