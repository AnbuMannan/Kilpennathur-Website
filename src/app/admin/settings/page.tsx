import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin");
  }

  const settings = await prisma.siteSetting.findMany({
    orderBy: { category: "asc" },
  });

  return <SettingsClient initialSettings={settings} />;
}
