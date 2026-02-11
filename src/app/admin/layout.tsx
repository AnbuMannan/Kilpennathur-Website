import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
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

  // Fetch feature flags for admin navigation
  let featureFlags = {
    enableSchemes: true,
    enableClassifieds: true,
    enableBusTimings: true,
    enableHelplines: true,
  };

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { category: "display" },
    });
    const getFlag = (key: string) =>
      settings.find((s) => s.key === key)?.value !== "false";

    featureFlags = {
      enableSchemes: getFlag("enableSchemes"),
      enableClassifieds: getFlag("enableClassifieds"),
      enableBusTimings: getFlag("enableBusTimings"),
      enableHelplines: getFlag("enableHelplines"),
    };
  } catch {
    // Default: everything enabled
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-60 shrink-0 border-r border-border bg-card p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Kilpennathur Admin</h2>
        <div className="mb-4">
          <AdminCommandSearch />
        </div>
        <AdminNav featureFlags={featureFlags} />
        <div className="mt-auto pt-4 flex flex-col gap-1">
          <AdminSettingsLink />
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
