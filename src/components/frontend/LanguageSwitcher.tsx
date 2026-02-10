"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LOCALE_COOKIE = "NEXT_LOCALE";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read locale from cookie on mount
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];
    if (cookieLocale) {
      setLocale(cookieLocale);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const switchLocale = (newLocale: string) => {
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=31536000`;
    setLocale(newLocale);
    setOpen(false);
    router.refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium rounded-md px-3 h-8",
          "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Languages className="w-4 h-4" />
        <span className="uppercase font-semibold">
          {locale === "en" ? "EN" : "த"}
        </span>
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute right-0 top-full mt-1 w-40 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1 z-50 transition-all duration-150",
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1"
        )}
        role="listbox"
        aria-label="Select language"
      >
        <button
          type="button"
          role="option"
          aria-selected={locale === "en"}
          onClick={() => switchLocale("en")}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
            locale === "en"
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <span className="text-sm">🇬🇧</span>
          English
        </button>
        <button
          type="button"
          role="option"
          aria-selected={locale === "ta"}
          onClick={() => switchLocale("ta")}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
            locale === "ta"
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <span className="text-sm">🇮🇳</span>
          தமிழ் (Tamil)
        </button>
      </div>
    </div>
  );
}
