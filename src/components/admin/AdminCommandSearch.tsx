"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Newspaper,
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  Landmark,
  ShoppingBag,
  Search,
  Loader2,
} from "lucide-react";
import { searchAdmin } from "@/lib/actions/adminSearch";

type SearchResult = {
  type: string;
  id: string;
  title: string;
  editUrl: string;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  News: <Newspaper className="h-4 w-4 text-blue-500" />,
  Job: <Briefcase className="h-4 w-4 text-orange-500" />,
  Village: <MapPin className="h-4 w-4 text-teal-500" />,
  Event: <Calendar className="h-4 w-4 text-pink-500" />,
  Business: <Building2 className="h-4 w-4 text-violet-500" />,
  Scheme: <Landmark className="h-4 w-4 text-indigo-500" />,
  Classified: <ShoppingBag className="h-4 w-4 text-rose-500" />,
};

export function AdminCommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchAdmin(query);
        setResults(data);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (editUrl: string) => {
      setOpen(false);
      setQuery("");
      setResults([]);
      router.push(editUrl);
    },
    [router],
  );

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
          Ctrl K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search news, jobs, villages, events..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isPending && (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </div>
          )}

          {!isPending && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>No results found for &quot;{query}&quot;</CommandEmpty>
          )}

          {!isPending && query.length < 2 && (
            <CommandEmpty>Type at least 2 characters to search...</CommandEmpty>
          )}

          {groupKeys.map((type, i) => (
            <div key={type}>
              {i > 0 && <CommandSeparator />}
              <CommandGroup heading={type}>
                {grouped[type].map((item) => (
                  <CommandItem
                    key={`${item.type}-${item.id}`}
                    value={`${item.title} ${item.type}`}
                    onSelect={() => handleSelect(item.editUrl)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{TYPE_ICONS[item.type] ?? null}</span>
                    <span className="flex-1 truncate">{item.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.type}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
