import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { LogoutButton } from "./LogoutButton";
import { AdminNav } from "./AdminNav";
import { AdminSettingsLink } from "./AdminSettingsLink";
import { AdminCommandSearch } from "@/components/admin/AdminCommandSearch";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as { role?: string })?.role;
  if (userRole !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-60 shrink-0 border-r border-border bg-card p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Kilpennathur Admin</h2>
        <div className="mb-4">
          <AdminCommandSearch />
        </div>
        <AdminNav />
        <div className="mt-auto pt-4 flex flex-col gap-1">
          <AdminSettingsLink />
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
