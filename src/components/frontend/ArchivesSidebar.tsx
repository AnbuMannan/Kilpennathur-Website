"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArchiveMonth {
  year: number;
  month: number;
  count: number;
}

interface ArchivesSidebarProps {
  archives: ArchiveMonth[];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ArchivesSidebar({ archives }: ArchivesSidebarProps) {
  // Group by year
  const archivesByYear = archives.reduce(
    (acc, archive) => {
      if (!acc[archive.year]) acc[archive.year] = [];
      acc[archive.year].push(archive);
      return acc;
    },
    {} as Record<number, ArchiveMonth[]>
  );

  const years = Object.keys(archivesByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Archives</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {years.map((year) => (
            <div key={year}>
              {archivesByYear[parseInt(year)]
                .sort((a, b) => b.month - a.month)
                .map((archive) => (
                  <Link
                    key={`${archive.year}-${archive.month}`}
                    href={`/news?year=${archive.year}&month=${archive.month}`}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
                      {monthNames[archive.month - 1]} {archive.year}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({archive.count})
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
