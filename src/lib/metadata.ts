import type { Metadata } from "next";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title,
  description,
  path,
  image = "/og-image.jpg",
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
}: GenerateMetadataProps): Metadata {
  const baseUrl = "https://kilpennathur.com";
  const url = `${baseUrl}${path}`;

  const defaultKeywords = [
    "kilpennathur",
    "tamil nadu",
    "tiruvannamalai",
    "local news",
    "community",
    "business directory",
  ];

  return {
    title: `${title} - Kilpennathur Community Portal`,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: "Kilpennathur.com" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "Kilpennathur Community Portal",
      type,
      images: [
        {
          url: `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}${image}`],
      creator: "@kilpennathur",
    },
    alternates: {
      canonical: url,
      languages: {
        en: url,
        ta: `${baseUrl}/ta${path}`,
      },
    },
  };
}
