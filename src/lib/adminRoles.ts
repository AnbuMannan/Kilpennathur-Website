/**
 * Role-based access for admin UI.
 * Add roles to nav items and section visibility.
 * Currently only "admin" exists; extend when adding editor, moderator, etc.
 */

export type AdminRole = "admin" | "editor" | "moderator";

export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  admin: 100,
  editor: 50,
  moderator: 25,
};

export function hasRole(userRole: string | undefined, required: AdminRole): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole as AdminRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[required];
  return userLevel >= requiredLevel;
}

export function canAccessSection(
  userRole: string | undefined,
  section: AdminRole
): boolean {
  return hasRole(userRole, section);
}
