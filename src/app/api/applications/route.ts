import { NextResponse } from "next/server";
import { createApplication } from "@/lib/applications";
import { notifyAdmins } from "@/lib/telegram";

export const runtime = "nodejs";

const requestWindows = new Map<string, { count: number; resetAt: number }>();

function corsHeaders(origin: string | null): HeadersInit {
  if (!origin) return {};
  const configured = (process.env.APPLICATION_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const developmentOrigins =
    process.env.NODE_ENV !== "production"
      ? ["null", "http://localhost:8001", "http://127.0.0.1:8001"]
      : [];
  const allowed = [...configured, ...developmentOrigins];
  if (!allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && Object.keys(corsHeaders(origin)).length === 0) {
    return NextResponse.json({ error: "Origin is not allowed." }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip");
  const now = Date.now();
  requestWindows.forEach((entry, key) => {
    if (entry.resetAt <= now) requestWindows.delete(key);
  });
  if (ip) {
    const window = requestWindows.get(ip);
    if (window && window.count >= 5 && window.resetAt > now) {
      return NextResponse.json(
        { error: "Juda ko‘p ariza yuborildi. Birozdan keyin qayta urinib ko‘ring." },
        { status: 429, headers: corsHeaders(origin) }
      );
    }
    if (window && window.resetAt > now) window.count += 1;
    else requestWindows.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: corsHeaders(origin) });
  }

  const name = typeof payload.name === "string" ? payload.name.trim().slice(0, 100) : "";
  const phoneDigits = typeof payload.phone === "string" ? payload.phone.replace(/\D/g, "") : "";
  const course = typeof payload.course === "string" ? payload.course.trim().slice(0, 140) : "";
  const experience = typeof payload.experience === "string" ? payload.experience.trim().slice(0, 80) : "";

  if (name.length < 2 || !/^\d{9}$/.test(phoneDigits) || !course || !experience) {
    return NextResponse.json(
      { error: "Ism, kurs, tajriba va 9 xonali O‘zbekiston telefon raqamini kiriting." },
      { status: 422, headers: corsHeaders(origin) }
    );
  }

  try {
    const application = createApplication({ name, phone: `+998${phoneDigits}`, course, experience });
    if (!application) throw new Error("Application was not saved.");
    const notified = await notifyAdmins(application);
    return NextResponse.json({ ok: true, notified }, { status: 201, headers: corsHeaders(origin) });
  } catch (error) {
    console.error("Failed to save course application:", error);
    return NextResponse.json(
      { error: "Ariza saqlanmadi. Birozdan keyin qayta urinib ko‘ring." },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
