import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kilpennathur.com";

export async function GET() {
  const news = await prisma.news.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 50,
    include: { author: true },
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kilpennathur Community News</title>
    <link>${BASE_URL}</link>
    <description>Latest news from Kilpennathur and surrounding villages</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${news
      .map(
        (item) => `
    <item>
      <title><![CDATA[${escapeXml(item.title)}]]></title>
      <link>${BASE_URL}/news/${item.slug}</link>
      <description><![CDATA[${escapeXml(item.excerpt || "")}]]></description>
      <author>${escapeXml(item.author.email)} (${escapeXml(item.author.name)})</author>
      <pubDate>${item.publishedAt?.toUTCString() ?? ""}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/news/${item.slug}</guid>
    </item>
    `
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
