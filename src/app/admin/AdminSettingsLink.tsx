"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

export function AdminSettingsLink() {
  const pathname = usePathname();

  return (
    <Link
      href="/admin/settings"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        pathname === "/admin/settings"
          ? "bg-blue-100 text-blue-600"
          : "hover:bg-gray-100"
      }`}
    >
      <Settings className="w-5 h-5" />
      <span>Settings</span>
    </Link>
  );
}
