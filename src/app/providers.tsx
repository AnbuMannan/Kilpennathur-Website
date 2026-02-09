"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ProgressBar } from "@/components/frontend/ProgressBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ProgressBar />
        {children}
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </SessionProvider>
  );
}
