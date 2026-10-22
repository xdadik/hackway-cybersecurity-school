import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { authenticate, createSession, setSessionCookie } from "@/lib/auth";

interface SignInPayload {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const payload = await readJson<SignInPayload>(request);
  if (!payload) return jsonError("Invalid request body.", 400);

  const email = (payload.email ?? "").trim();
  const password = payload.password ?? "";

  if (!email || !password) {
    return jsonError("Enter your email address and password.", 422);
  }

  const user = authenticate(email, password);
  if (!user) {
    return jsonError("Those details did not match an account.", 401);
  }

  const { token, expiresAt } = createSession(user.id);
  setSessionCookie(token, expiresAt);

  return NextResponse.json({ user });
}
