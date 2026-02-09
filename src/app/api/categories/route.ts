import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const { name, nameTamil, slug: rawSlug, type } = body as {
      name?: string;
      nameTamil?: string;
      slug?: string;
      type?: string;
    };

    const nameTrim = typeof name === "string" ? name.trim() : "";
    if (!nameTrim) {
      return NextResponse.json(
        { error: "Name (English) is required" },
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

    const validTypes = ["news", "business", "event"];
    const categoryType = validTypes.includes(
      typeof type === "string" ? type : ""
    )
      ? type
      : "news";

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: nameTrim,
        nameTamil:
          typeof nameTamil === "string" && nameTamil.trim()
            ? nameTamil.trim()
            : null,
        slug,
        type: categoryType,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
