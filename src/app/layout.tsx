import type { Metadata } from "next";
import { Inter, Noto_Sans_Tamil, Merriweather } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import Analytics from "./analytics";
// import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/JsonLd";
import { CookieConsent } from "@/components/frontend/CookieConsent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kilpennathur - கீழ்பென்னாத்தூர்",
  description: "Community news and information portal for Kilpennathur and surrounding villages",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kilpennathur",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansTamil.variable} ${merriweather.variable} antialiased`}
        suppressHydrationWarning
      >
        <WebSiteJsonLd />
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Analytics />
        {/* <VercelAnalytics /> */}
        <CookieConsent />
      </body>
    </html>
  );
}
