import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/frontend/Header";
import { Footer } from "@/components/frontend/Footer";
import { BackToTop } from "@/components/frontend/BackToTop";
import { WhatsAppFloat } from "@/components/frontend/WhatsAppFloat";

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
    <>
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
