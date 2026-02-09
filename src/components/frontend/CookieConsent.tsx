"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" aria-hidden />
          <div>
            <p className="font-semibold mb-1">We use cookies</p>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience and analyze our
              traffic. By clicking &quot;Accept&quot;, you consent to our use of
              cookies.{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline"
              >
                Learn more
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button onClick={declineCookies} variant="outline" size="sm">
            Decline
          </Button>
          <Button onClick={acceptCookies} size="sm">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
