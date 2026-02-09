import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = newsletterSchema.parse(body);

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
}
