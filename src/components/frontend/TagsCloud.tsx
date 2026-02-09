"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Tag {
  name: string;
  count: number;
}

interface TagsCloudProps {
  tags: Tag[];
}

export default function TagsCloud({ tags }: TagsCloudProps) {
  if (tags.length === 0) return null;

  // Sort by count and limit to top 20
  const topTags = tags
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Popular Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/news?search=${encodeURIComponent(tag.name)}`}
            >
              <Badge
                variant="outline"
                className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                {tag.name} ({tag.count})
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
