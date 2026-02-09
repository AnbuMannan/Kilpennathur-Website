import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, Mail, Download } from "lucide-react";
import { NewsletterFilters } from "./NewsletterFilters";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

type Props = { searchParams: Promise<{ search?: string }> };

export default async function AdminNewsletterPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = toStr(params.search).trim().toLowerCase();

  const where = search
    ? { email: { contains: search, mode: "insensitive" as const } }
    : {};

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <p className="text-muted-foreground mt-1">
          Manage email newsletter subscriptions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Subscribers ({subscribers.length})
            </CardTitle>
            {subscribers.length > 0 && (
              <Link
                href="/api/admin/newsletter/export"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Link>
            )}
          </div>
          <NewsletterFilters />
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No subscribers yet</p>
              <p className="text-sm mt-1">
                Newsletter signups from the footer will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`mailto:${sub.email}`}
                            className="text-primary hover:underline"
                          >
                            {sub.email}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(sub.createdAt)}
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
