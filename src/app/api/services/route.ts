import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
      select: { title: true, titleTamil: true, slug: true },
    });

    return NextResponse.json(services);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
