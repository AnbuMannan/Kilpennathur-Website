"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Newspaper,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  type: "news" | "business" | "village" | "event" | "job";
  id: string;
  title: string;
  titleTamil?: string;
  slug?: string;
  category?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleResultClick = (result: SearchResult) => {
    let url = "";
    switch (result.type) {
      case "news":
        url = `/news/${result.slug}`;
        break;
      case "business":
        url = `/directory/${result.id}`;
        break;
      case "village":
        url = `/villages/${result.slug}`;
        break;
      case "event":
        url = `/events/${result.id}`;
        break;
      case "job":
        url = `/jobs/${result.id}`;
        break;
    }
    router.push(url);
    setOpen(false);
    setQuery("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "news":
        return <Newspaper className="w-4 h-4" />;
      case "business":
        return <Building2 className="w-4 h-4" />;
      case "village":
        return <MapPin className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      case "job":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Search Trigger — icon on mobile, wider on desktop */}
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 xl:hidden h-8 w-8"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="relative hidden xl:inline-flex justify-start text-sm text-muted-foreground h-8 w-44 pr-10"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-3.5 w-3.5 shrink-0" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium hidden xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search for news, businesses, villages, and events
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Type to search..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="text-center py-8 text-gray-500">
                Searching...
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found for &quot;{query}&quot;
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-start gap-3"
                  >
                    <div className="mt-1 text-muted-foreground shrink-0">
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{result.title}</p>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {result.type}
                        </Badge>
                      </div>
                      {result.titleTamil && (
                        <p className="text-sm text-muted-foreground truncate">
                          {result.titleTamil}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
