import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const villages = await prisma.village.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(villages);
  } catch (error) {
    console.error("GET /api/villages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch villages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, nameTamil, slug: rawSlug, description } = body as {
      name?: string;
      nameTamil?: string;
      slug?: string;
      description?: string;
    };

    const nameTrim = typeof name === "string" ? name.trim() : "";
    const nameTamilTrim = typeof nameTamil === "string" ? nameTamil.trim() : "";
    if (!nameTrim) {
      return NextResponse.json(
        { error: "Name (English) is required" },
        { status: 400 }
      );
    }
    if (!nameTamilTrim) {
      return NextResponse.json(
        { error: "Name (Tamil) is required" },
        { status: 400 }
      );
    }

    const slug =
      typeof rawSlug === "string" && rawSlug.trim()
        ? rawSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
        : nameTrim.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required or could not be generated" },
        { status: 400 }
      );
    }

    const existing = await prisma.village.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A village with this slug already exists" },
        { status: 409 }
      );
    }

    const village = await prisma.village.create({
      data: {
        name: nameTrim,
        nameTamil: nameTamilTrim,
        slug,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : undefined,
      },
    });
    return NextResponse.json(village);
  } catch (error) {
    console.error("POST /api/villages error:", error);
    return NextResponse.json(
      { error: "Failed to create village" },
      { status: 500 }
    );
  }
}
