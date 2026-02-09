import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "Kilpennathur News";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await prisma.news.findFirst({
    where: { slug, status: "published" },
    select: {
      title: true,
      titleTamil: true,
      category: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  if (!news) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "white",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Article Not Found
        </div>
      ),
      { ...size }
    );
  }

  const dateStr = news.publishedAt
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
        new Date(news.publishedAt)
      )
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(168, 85, 247, 0.10)",
          }}
        />

        {/* Top bar — Category + Date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 56px 0 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(59, 130, 246, 0.2)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: 999,
              padding: "6px 18px",
              fontSize: 16,
              fontWeight: 700,
              color: "#93c5fd",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {news.category}
          </div>
          {dateStr && (
            <div
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 500,
              }}
            >
              {dateStr}
            </div>
          )}
        </div>

        {/* Main content — Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            padding: "0 56px",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: news.title.length > 80 ? 36 : news.title.length > 50 ? 44 : 52,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              letterSpacing: -1,
              maxWidth: 1000,
              display: "flex",
            }}
          >
            {news.title}
          </div>

          {news.titleTamil && (
            <div
              style={{
                fontSize: 24,
                color: "rgba(255, 255, 255, 0.55)",
                lineHeight: 1.4,
                maxWidth: 900,
                display: "flex",
              }}
            >
              {news.titleTamil}
            </div>
          )}
        </div>

        {/* Bottom bar — Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px 40px 56px",
          }}
        >
          {/* Logo / Site name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Logo circle */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 900,
                color: "white",
              }}
            >
              K
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: -0.5,
                }}
              >
                Kilpennathur.com
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 500,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Community News Portal
              </div>
            </div>
          </div>

          {/* Author */}
          {news.author?.name && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "rgba(255,255,255,0.45)",
                fontWeight: 500,
              }}
            >
              By {news.author.name}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
