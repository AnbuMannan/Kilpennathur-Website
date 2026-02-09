"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarkReadButton({
  messageId,
  read,
  className,
}: {
  messageId: string;
  read: boolean;
  className?: string;
}) {
  const router = useRouter();

  const handleToggle = async () => {
    await fetch(`/api/admin/contact/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    router.refresh();
  };

  return (
    <Button
      variant={read ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      className={cn(className)}
    >
      {read ? (
        <>
          <Mail className="w-4 h-4 mr-1" />
          Mark unread
        </>
      ) : (
        <>
          <Check className="w-4 h-4 mr-1" />
          Mark read
        </>
      )}
    </Button>
  );
}
