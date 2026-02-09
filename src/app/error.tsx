"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-4" />
          <div className="w-32 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Something went wrong!
        </h1>
        <p className="text-xl text-gray-600 mb-2">ஏதோ தவறு நிகழ்ந்துள்ளது</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try refreshing the page or
          contact support if the problem persists.
        </p>

        {/* Error Details (in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 p-4 rounded-lg mb-8 text-left">
            <p className="text-sm font-mono text-red-600">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
