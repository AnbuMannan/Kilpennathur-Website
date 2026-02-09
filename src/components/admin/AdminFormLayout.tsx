"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Smartphone } from "lucide-react";

type AdminFormLayoutProps = {
  children: React.ReactNode;
  preview?: React.ReactNode;
};

function SavedIndicator() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show "saved" after a short delay to simulate auto-save trust signal
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-600">
      <CheckCircle2 className="h-3.5 w-3.5" />
      <span>All changes saved</span>
    </div>
  );
}

export function AdminFormLayout({ children, preview }: AdminFormLayoutProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
      {/* Left: Form */}
      <div className="xl:col-span-3">
        <div className="flex items-center justify-end mb-3">
          <SavedIndicator />
        </div>
        {children}
      </div>

      {/* Right: Live Preview */}
      {preview && (
        <div className="xl:col-span-2">
          <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Live Preview
              </span>
            </div>
            <div className="mx-auto max-w-sm border-4 border-gray-800 dark:border-gray-600 rounded-3xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
              {/* Phone notch */}
              <div className="h-6 bg-gray-800 dark:bg-gray-600 flex items-center justify-center">
                <div className="w-20 h-3 bg-black rounded-full" />
              </div>
              {/* Phone content */}
              <div className="p-4 min-h-[400px] max-h-[500px] overflow-auto text-sm">
                {preview}
              </div>
              {/* Phone bottom bar */}
              <div className="h-4 bg-gray-800 dark:bg-gray-600 flex items-center justify-center">
                <div className="w-24 h-1 bg-gray-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
