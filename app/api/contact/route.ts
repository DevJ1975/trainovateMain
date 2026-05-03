import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

// Tiny in-memory rate limiter — per-instance only. Swap for Upstash if needed.
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (b.count >= MAX_PER_WINDOW) return false;
  b.count += 1;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@trainovate.tech";
  const from = process.env.CONTACT_FROM_EMAIL || "no-reply@trainovate.tech";

  if (!apiKey) {
    // No-op in dev without Resend configured.
    console.log("[contact] (dev, no RESEND_API_KEY)", data);
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const resend = new Resend(apiKey);
    const subject = `[Trainovate] ${data.name} · ${data.org}${data.federal ? " · FEDERAL" : ""}`;

    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organization: ${data.org}`,
      data.role ? `Role: ${data.role}` : null,
      data.industry ? `Industry: ${data.industry}` : null,
      `Interests: ${data.interests.join(", ")}`,
      `Federal: ${data.federal ? "yes" : "no"}`,
      "",
      "Message:",
      data.message,
    ].filter(Boolean);

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text: lines.join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[contact] resend error", err);
    return NextResponse.json(
      { ok: false, error: "Email service failed. Please try again." },
      { status: 500 }
    );
  }
}
