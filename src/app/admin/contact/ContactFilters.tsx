"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function ContactFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const search = (form.elements.namedItem("search") as HTMLInputElement)?.value?.trim() ?? "";
    const status = (form.elements.namedItem("status") as HTMLSelectElement)?.value ?? "all";
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    router.push(`/admin/contact?${params.toString()}`);
  };

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          name="search"
          defaultValue={search}
          placeholder="Search name, email, subject..."
          className="pl-9"
        />
      </div>
      <select
        name="status"
        defaultValue={status}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">All status</option>
        <option value="read">Read</option>
        <option value="unread">Unread</option>
      </select>
      <Button type="submit" size="default">
        Filter
      </Button>
      {(search || status !== "all") && (
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/contact")}
        >
          Clear
        </Button>
      )}
    </form>
  );
}
