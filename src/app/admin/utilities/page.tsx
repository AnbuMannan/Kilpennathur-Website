import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Bus, Phone, AlertCircle } from "lucide-react";

export default async function AdminUtilitiesPage() {
  let enableBusTimings = true;
  let enableHelplines = true;

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { category: "display" },
    });
    const getFlag = (key: string) =>
      settings.find((s) => s.key === key)?.value !== "false";
    enableBusTimings = getFlag("enableBusTimings");
    enableHelplines = getFlag("enableHelplines");
  } catch {
    // Default: enabled
  }

  // Smart redirect: go to the first enabled sub-page
  if (enableBusTimings) redirect("/admin/utilities/bus");
  if (enableHelplines) redirect("/admin/utilities/helplines");

  // Both disabled — show a message
  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto">
        <AlertCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">No Utilities Enabled</h1>
        <p className="text-muted-foreground mt-2">
          Both Bus Timings and Helplines modules are currently disabled.
          You can enable them from the Settings page.
        </p>
      </div>
      <Link
        href="/admin/settings"
        className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Go to Settings
      </Link>
    </div>
  );
}
