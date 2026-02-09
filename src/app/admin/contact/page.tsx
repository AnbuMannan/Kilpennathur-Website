import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Inbox } from "lucide-react";
import { ContactFilters } from "./ContactFilters";
import { InboxClient } from "./InboxClient";

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

type Props = { searchParams: Promise<{ search?: string; status?: string }> };

export default async function AdminContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = toStr(params.search).trim().toLowerCase();
  const statusFilter = toStr(params.status);

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { subject: { contains: search, mode: "insensitive" as const } },
        { message: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(statusFilter === "read" && { read: true }),
    ...(statusFilter === "unread" && { read: false }),
  };

  const [messages, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  // Serialize dates for client component
  const serialized = messages.map((msg) => ({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    phone: msg.phone,
    subject: msg.subject,
    message: msg.message,
    read: msg.read,
    createdAt: msg.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Inbox</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {messages.length} message{messages.length !== 1 ? "s" : ""} total
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <ContactFilters />

      <InboxClient messages={serialized} />
    </div>
  );
}
