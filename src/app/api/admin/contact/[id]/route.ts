import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { read } = body as { read?: boolean };

  if (typeof read !== "boolean") {
    return NextResponse.json(
      { error: "Invalid body: read must be boolean" },
      { status: 400 }
    );
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { read },
  });

  return NextResponse.json({ ok: true });
}
