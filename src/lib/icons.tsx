import {
  Shield,
  ShieldCheck,
  FileText,
  Landmark,
  Heart,
  Car,
  Home,
  Calculator,
  Briefcase,
  Scale,
  Receipt,
  BadgeIndianRupee,
  Stethoscope,
  GraduationCap,
  Leaf,
  Flame,
  Plane,
  Umbrella,
  Building2,
  HandCoins,
  type LucideProps,
} from "lucide-react";
import type { FC } from "react";

const ICON_MAP: Record<string, FC<LucideProps>> = {
  shield: Shield,
  shieldcheck: ShieldCheck,
  filetext: FileText,
  landmark: Landmark,
  heart: Heart,
  car: Car,
  home: Home,
  calculator: Calculator,
  briefcase: Briefcase,
  scale: Scale,
  receipt: Receipt,
  badgeindianrupee: BadgeIndianRupee,
  stethoscope: Stethoscope,
  graduationcap: GraduationCap,
  leaf: Leaf,
  flame: Flame,
  plane: Plane,
  umbrella: Umbrella,
  building2: Building2,
  handcoins: HandCoins,
};

type DynamicIconProps = Omit<LucideProps, "name"> & {
  name: string | null | undefined;
  /** Fallback icon when name is not found */
  fallback?: FC<LucideProps>;
};

/**
 * Renders a Lucide icon by name string (case-insensitive).
 * Falls back to ShieldCheck if the icon name is not recognized.
 */
export function DynamicIcon({
  name,
  fallback: Fallback = ShieldCheck,
  ...props
}: DynamicIconProps) {
  if (!name) return <Fallback {...props} />;

  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const Icon = ICON_MAP[key] ?? Fallback;
  return <Icon {...props} />;
}
