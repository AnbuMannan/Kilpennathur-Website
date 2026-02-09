import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_PLATFORMS = ["facebook", "twitter", "whatsapp"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newsId, platform } = body as { newsId?: string; platform?: string };

    if (!newsId || typeof newsId !== "string" || !platform || typeof platform !== "string") {
      return NextResponse.json(
        { error: "newsId and platform are required" },
        { status: 400 }
      );
    }

    const platformLower = platform.toLowerCase();
    if (!VALID_PLATFORMS.includes(platformLower as (typeof VALID_PLATFORMS)[number])) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    await prisma.shareAnalytics.upsert({
      where: {
        newsId_platform: { newsId, platform: platformLower },
      },
      update: { count: { increment: 1 } },
      create: { newsId, platform: platformLower, count: 1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track share" }, { status: 500 });
  }
}
