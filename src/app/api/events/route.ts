import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
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

    const created = await prisma.event.create({
      data: {
        title: titleTrim,
        titleTamil:
          typeof titleTamil === "string" && titleTamil.trim()
            ? titleTamil.trim()
            : undefined,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : undefined,
        date: eventDate,
        image: typeof image === "string" && image.trim() ? image.trim() : undefined,
      },
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
