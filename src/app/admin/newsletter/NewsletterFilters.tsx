"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function NewsletterFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const search = (form.elements.namedItem("search") as HTMLInputElement)?.value?.trim() ?? "";
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/newsletter?${params.toString()}`);
  };

  const search = searchParams.get("search") ?? "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          name="search"
          defaultValue={search}
          placeholder="Search by email..."
          className="pl-9"
        />
      </div>
      <Button type="submit" size="default">
        Search
      </Button>
      {search && (
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/newsletter")}
        >
          Clear
        </Button>
      )}
    </form>
  );
}
