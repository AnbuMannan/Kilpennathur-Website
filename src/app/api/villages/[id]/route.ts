import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  const { id } = await params;
  try {
    const village = await prisma.village.findUnique({
      where: { id },
    });
    if (!village) {
      return NextResponse.json({ error: "Village not found" }, { status: 404 });
    }
    return NextResponse.json(village);
  } catch (error) {
    console.error("GET /api/villages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch village" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const existing = await prisma.village.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Village not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name, nameTamil, slug: rawSlug, description,
      presidentName, presidentNameTamil, presidentImage,
      population, totalStreets, wardCount,
    } = body as {
      name?: string;
      nameTamil?: string;
      slug?: string;
      description?: string;
      presidentName?: string;
      presidentNameTamil?: string;
      presidentImage?: string;
      population?: number;
      totalStreets?: number;
      wardCount?: number;
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

    const slugConflict = await prisma.village.findFirst({
      where: { slug, id: { not: id } },
    });
    if (slugConflict) {
      return NextResponse.json(
        { error: "A village with this slug already exists" },
        { status: 409 }
      );
    }

    const village = await prisma.village.update({
      where: { id },
      data: {
        name: nameTrim,
        nameTamil: nameTamilTrim,
        slug,
        description:
          typeof description === "string"
            ? (description.trim() || null)
            : undefined,
        presidentName: typeof presidentName === "string" ? (presidentName.trim() || null) : undefined,
        presidentNameTamil: typeof presidentNameTamil === "string" ? (presidentNameTamil.trim() || null) : undefined,
        presidentImage: typeof presidentImage === "string" ? (presidentImage.trim() || null) : undefined,
        population: typeof population === "number" ? population : undefined,
        totalStreets: typeof totalStreets === "number" ? totalStreets : undefined,
        wardCount: typeof wardCount === "number" ? wardCount : undefined,
      },
    });
    return NextResponse.json(village);
  } catch (error) {
    console.error("PUT /api/villages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update village" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const existing = await prisma.village.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Village not found" }, { status: 404 });
    }

    await prisma.village.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/villages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete village" },
      { status: 500 }
    );
  }
}
