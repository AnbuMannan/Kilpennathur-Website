import Link from "next/link";
import { ChevronRight, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
  _count?: {
    news: number;
  };
}

interface CategoriesWidgetProps {
  categories: Category[];
}

export default function CategoriesWidget({ categories }: CategoriesWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/news?category=${category.slug}`}
              className="flex items-center justify-between py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {category._count && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({category._count.news})
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
