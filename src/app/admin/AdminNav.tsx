"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Building2,
  MapPin,
  Briefcase,
  Landmark,
  ShoppingBag,
  FolderOpen,
  Mail,
  Users,
  ImagePlus,
  Bus,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { canAccessSection } from "@/lib/adminRoles";
import type { AdminRole } from "@/lib/adminRoles";

interface AdminFeatureFlags {
  enableSchemes: boolean;
  enableClassifieds: boolean;
  enableBusTimings: boolean;
  enableHelplines: boolean;
}

const navLinks: { href: string; label: string; icon: typeof LayoutDashboard; role: AdminRole; flag?: keyof AdminFeatureFlags }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, role: "CUSTOMER" },
  { href: "/admin/news", label: "News", icon: Newspaper, role: "CUSTOMER" },
  { href: "/admin/events", label: "Events", icon: Calendar, role: "CUSTOMER" },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, role: "CUSTOMER" },
  { href: "/admin/business", label: "Business", icon: Building2, role: "CUSTOMER" },
  { href: "/admin/villages", label: "Villages", icon: MapPin, role: "CUSTOMER" },
  { href: "/admin/schemes", label: "Schemes", icon: Landmark, role: "CUSTOMER", flag: "enableSchemes" },
  { href: "/admin/classifieds", label: "Classifieds", icon: ShoppingBag, role: "CUSTOMER", flag: "enableClassifieds" },
  { href: "/admin/utilities", label: "Utilities", icon: Bus, role: "CUSTOMER" },
  { href: "/admin/services", label: "My Services", icon: ShieldCheck, role: "CUSTOMER" },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen, role: "ADMIN" },
  { href: "/admin/contact", label: "Contact", icon: Mail, role: "ADMIN" },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users, role: "ADMIN" },
  { href: "/admin/media", label: "Media", icon: ImagePlus, role: "ADMIN" },
];

export function AdminNav({ featureFlags }: { featureFlags?: AdminFeatureFlags }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";

  const ff = featureFlags ?? {
    enableSchemes: true,
    enableClassifieds: true,
    enableBusTimings: true,
    enableHelplines: true,
  };

  // Hide Utilities if both Bus Timings and Helplines are disabled
  const hideUtilities = !ff.enableBusTimings && !ff.enableHelplines;

  return (
    <nav className="flex flex-col gap-1">
      {navLinks
        .filter((link) => canAccessSection(userRole, link.role))
        .filter((link) => {
          // Hide items whose feature flag is off
          if (link.flag && !ff[link.flag]) return false;
          // Hide Utilities if both sub-features are disabled
          if (link.label === "Utilities" && hideUtilities) return false;
          return true;
        })
        .map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        );
      })}

      {isAdmin && (
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            pathname.startsWith("/admin/settings")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span>Settings</span>
        </Link>
      )}
    </nav>
  );
}
