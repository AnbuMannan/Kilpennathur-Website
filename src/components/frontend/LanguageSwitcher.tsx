"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const LOCALE_COOKIE = "NEXT_LOCALE";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<string>("en");

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

  const switchLocale = (newLocale: string) => {
    // Set cookie for locale
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=31536000`; // 1 year
    setLocale(newLocale);
    // Refresh the page to apply new locale
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="w-4 h-4" />
          <span className="uppercase font-semibold">
            {locale === "en" ? "EN" : "த"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale("en")}
          className={locale === "en" ? "bg-blue-50" : ""}
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">🇬🇧</span>
            English
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale("ta")}
          className={locale === "ta" ? "bg-blue-50" : ""}
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">🇮🇳</span>
            தமிழ் (Tamil)
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
