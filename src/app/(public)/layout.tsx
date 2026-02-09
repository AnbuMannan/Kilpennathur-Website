import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/frontend/Header";
import { Footer } from "@/components/frontend/Footer";
import { BackToTop } from "@/components/frontend/BackToTop";
import { WhatsAppFloat } from "@/components/frontend/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kilpennathur - Community News & Information Portal",
  description:
    "Your trusted source for local news, business directory, events, and community information in Kilpennathur and surrounding villages.",
  keywords:
    "kilpennathur, news, business directory, villages, events, tamil nadu, community",
  openGraph: {
    title: "Kilpennathur - Community News & Information Portal",
    description:
      "Your trusted source for local news, business directory, events, and community information in Kilpennathur and surrounding villages.",
    type: "website",
  },
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={inter.className}>
      <Header />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </div>
  );
}
