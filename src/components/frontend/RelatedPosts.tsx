import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  publishedAt?: Date | null;
  views: number;
}

interface RelatedPostsProps {
  posts: Post[];
  title?: string;
}

export default function RelatedPosts({
  posts,
  title = "Related Posts",
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="flex gap-3 group"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-200">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {post.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {post.publishedAt
                    ? formatDate(post.publishedAt)
                    : "Recently"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
