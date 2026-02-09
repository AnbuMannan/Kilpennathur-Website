/**
 * JSON-LD structured data component for SEO.
 * Renders script tags with schema.org markup for search engines.
 */

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://kilpennathur.com";

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kilpennathur Community Portal",
    alternateName: "கீழ்பென்னாத்தூர்",
    url: BASE_URL,
    description:
      "Community news and information portal for Kilpennathur and surrounding villages. Local news, business directory, events, and village information.",
    inLanguage: ["en", "ta"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/api/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kilpennathur Community Portal",
    alternateName: "Kilpennathur.com",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Community news and information portal for Kilpennathur, Tamil Nadu, India.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kilpennathur",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
