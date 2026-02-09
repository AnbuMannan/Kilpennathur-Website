import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, MessageSquare } from "lucide-react";
import { MarkReadButton } from "./MarkReadButton";
import { ContactFilters } from "./ContactFilters";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground mt-1">
          View and manage contact form submissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Messages
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} unread</Badge>
            )}
          </div>
          <ContactFilters />
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No contact messages yet</p>
              <p className="text-sm mt-1">
                Messages from the contact form will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow
                      key={msg.id}
                      className={msg.read ? "" : "bg-muted/50"}
                    >
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(msg.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {msg.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${msg.email}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Mail className="w-4 h-4" />
                          {msg.email}
                        </a>
                      </TableCell>
                      <TableCell>{msg.subject}</TableCell>
                      <TableCell>
                        {msg.read ? (
                          <Badge variant="outline">Read</Badge>
                        ) : (
                          <Badge>New</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <MarkReadButton messageId={msg.id} read={msg.read} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
