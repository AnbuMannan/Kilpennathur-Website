import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // We use the 'id' parameter as the slug for lookup
    await prisma.village.update({
      where: { slug: id },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
