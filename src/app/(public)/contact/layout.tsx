import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Kilpennathur.com. Send us your questions, feedback, or suggestions. We respond within 24 hours.",
  path: "/contact",
  keywords: ["contact", "தொடர்பு", "feedback", "questions"],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
