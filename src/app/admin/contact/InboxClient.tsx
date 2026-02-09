"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  User,
  Clock,
  Check,
  MailOpen,
  Reply,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    new Date(dateStr)
  );
}

function formatFullDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

export function InboxClient({ messages }: { messages: Message[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    await fetch(`/api/admin/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !currentRead }),
    });
    router.refresh();
  };

  return (
    <div className="flex h-[calc(100vh-200px)] rounded-xl border border-border overflow-hidden bg-card">
      {/* Left pane - Message list */}
      <div className="w-80 xl:w-96 shrink-0 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-1 overflow-auto divide-y divide-border">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
              <Inbox className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No messages</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                className={`w-full text-left p-3.5 hover:bg-muted/50 transition-colors ${
                  selectedId === msg.id
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : ""
                } ${!msg.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {/* Unread dot */}
                  <div className="mt-1.5 shrink-0">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        msg.read ? "bg-gray-300 dark:bg-gray-600" : "bg-blue-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm truncate ${
                          !msg.read ? "font-bold" : "font-medium"
                        }`}
                      >
                        {msg.name}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {timeAgo(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground/80 truncate mt-0.5">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {msg.message.slice(0, 80)}...
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right pane - Reading view */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Mail className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Select a message to read</p>
            <p className="text-xs mt-1">Click on a message from the list</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-5 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selected.subject}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {selected.name}
                    </span>
                    <a
                      href={`mailto:${selected.email}`}
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {selected.email}
                    </a>
                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone}`}
                        className="flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {selected.phone}
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatFullDate(selected.createdAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant={selected.read ? "outline" : "default"}
                  size="sm"
                  onClick={() =>
                    handleToggleRead(selected.id, selected.read)
                  }
                >
                  {selected.read ? (
                    <>
                      <MailOpen className="h-3.5 w-3.5 mr-1.5" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Mark Read
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
                    <Reply className="h-3.5 w-3.5 mr-1.5" />
                    Reply
                  </a>
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-5">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {selected.message}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
