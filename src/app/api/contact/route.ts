import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/* ================================================================
   SCHEMA
   ================================================================ */

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
  /* Honeypot field — real users never fill this */
  confirm_email: z.string().optional(),
});

/* ================================================================
   IN-MEMORY RATE LIMITER
   Max 3 messages per IP per hour.
   Uses a simple Map that cleans itself periodically.
   ================================================================ */

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — start fresh
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Clean stale entries every 10 minutes to prevent memory leak
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 10 * 60 * 1000;
  const cleanupKey = "__contactRateLimitCleanup";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(globalThis as any)[cleanupKey]) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, val] of rateLimitMap.entries()) {
        if (now > val.resetAt) {
          rateLimitMap.delete(key);
        }
      }
    }, CLEANUP_INTERVAL);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)[cleanupKey] = true;
  }
}

/* ================================================================
   ROUTE HANDLER
   ================================================================ */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    /* ── Honeypot check ──
       If the hidden field has a value, a bot filled it.
       Return 200 to trick the bot, but don't save anything. */
    if (validatedData.confirm_email) {
      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 200 }
      );
    }

    /* ── Rate limiting ──
       Max 3 messages per IP per hour. */
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: validatedData.name.trim(),
        email: validatedData.email.trim().toLowerCase(),
        phone: validatedData.phone?.trim() || null,
        subject: validatedData.subject.trim(),
        message: validatedData.message.trim(),
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
