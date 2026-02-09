"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-4 px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
    >
      Logout
    </button>
  );
}
