import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <div className="w-32 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-2">பக்கம் கிடைக்கவில்லை</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Please check the URL or navigate back to our homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/news">
              <Search className="w-5 h-5" />
              Browse News
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/directory" className="text-blue-600 hover:underline">
              Business Directory
            </Link>
            <Link href="/villages" className="text-blue-600 hover:underline">
              Villages
            </Link>
            <Link href="/events" className="text-blue-600 hover:underline">
              Events
            </Link>
            <Link href="/jobs" className="text-blue-600 hover:underline">
              Jobs
            </Link>
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
