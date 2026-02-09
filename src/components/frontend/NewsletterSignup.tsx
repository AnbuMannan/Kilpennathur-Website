"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Successfully subscribed to newsletter!");
        setEmail("");
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-12 h-12 mx-auto mb-4" aria-hidden />
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="text-blue-100 mb-6">
          Subscribe to our newsletter for the latest news and updates from
          Kilpennathur
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white text-gray-900 placeholder:text-gray-500"
            disabled={loading}
            aria-label="Email address"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-white text-blue-600 hover:bg-gray-100 shrink-0"
          >
            {loading ? (
              "Subscribing..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" aria-hidden />
                Subscribe
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
