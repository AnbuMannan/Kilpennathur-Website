import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, titleTamil, description, date: dateRaw, image } = body as {
      title?: string;
      titleTamil?: string;
      description?: string;
      date?: string;
      image?: string;
    };

    const titleTrim = typeof title === "string" ? title.trim() : "";
    if (!titleTrim) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (typeof dateRaw !== "string" || !dateRaw.trim()) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }
    const eventDate = new Date(dateRaw);
    if (Number.isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      );
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: titleTrim,
        titleTamil:
          typeof titleTamil === "string"
            ? (titleTamil.trim() || undefined)
            : undefined,
        description:
          typeof description === "string"
            ? (description.trim() || undefined)
            : undefined,
        date: eventDate,
        image: typeof image === "string" ? (image.trim() || undefined) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
