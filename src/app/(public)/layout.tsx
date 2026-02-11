import type { ReactNode } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { FeatureFlags } from "@/types";
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

async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { category: "display" },
    });
    const getFlag = (key: string) =>
      settings.find((s) => s.key === key)?.value !== "false";

    return {
      enableSchemes: getFlag("enableSchemes"),
      enableClassifieds: getFlag("enableClassifieds"),
      enableBusTimings: getFlag("enableBusTimings"),
      enableHelplines: getFlag("enableHelplines"),
      enableNewsletter: getFlag("enable_newsletter"),
    };
  } catch {
    // Default: everything enabled
    return {
      enableSchemes: true,
      enableClassifieds: true,
      enableBusTimings: true,
      enableHelplines: true,
      enableNewsletter: true,
    };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const featureFlags = await getFeatureFlags();

  return (
    <>
      <Header featureFlags={featureFlags} />
      <main className="bg-gray-50 dark:bg-gray-900">{children}</main>
      <Footer featureFlags={featureFlags} />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
