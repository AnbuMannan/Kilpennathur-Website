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
} from "lucide-react";
import { canAccessSection } from "@/lib/adminRoles";
import type { AdminRole } from "@/lib/adminRoles";

const navLinks: { href: string; label: string; icon: typeof LayoutDashboard; role: AdminRole }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, role: "editor" },
  { href: "/admin/news", label: "News", icon: Newspaper, role: "editor" },
  { href: "/admin/events", label: "Events", icon: Calendar, role: "editor" },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, role: "editor" },
  { href: "/admin/business", label: "Business", icon: Building2, role: "editor" },
  { href: "/admin/villages", label: "Villages", icon: MapPin, role: "editor" },
  { href: "/admin/schemes", label: "Schemes", icon: Landmark, role: "editor" },
  { href: "/admin/classifieds", label: "Classifieds", icon: ShoppingBag, role: "editor" },
  { href: "/admin/utilities", label: "Utilities", icon: Bus, role: "editor" },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen, role: "admin" },
  { href: "/admin/contact", label: "Contact", icon: Mail, role: "admin" },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users, role: "admin" },
  { href: "/admin/media", label: "Media", icon: ImagePlus, role: "admin" },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role;

  return (
    <nav className="flex flex-col gap-1">
      {navLinks
        .filter((link) => canAccessSection(userRole, link.role))
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
    </nav>
  );
}
