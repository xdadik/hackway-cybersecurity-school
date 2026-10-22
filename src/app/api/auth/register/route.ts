import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import {
  createSession,
  createUser,
  findUserByEmail,
  setSessionCookie,
} from "@/lib/auth";
import { passwordStrengthError } from "@/lib/password";

interface RegisterPayload {
  name?: string;
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const payload = await readJson<RegisterPayload>(request);
  if (!payload) return jsonError("Invalid request body.", 400);

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim().toLowerCase();
  const password = payload.password ?? "";

  if (name.length < 2) {
    return jsonError("Enter your full name.", 422);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError("Enter a valid email address.", 422);
  }
  const strengthError = passwordStrengthError(password);
  if (strengthError) {
    return jsonError(strengthError, 422);
  }

  if (findUserByEmail(email)) {
    return jsonError("An account with this email already exists.", 409);
  }

  const userId = createUser(name, email, password);
  const { token, expiresAt } = createSession(userId);
  setSessionCookie(token, expiresAt);

  return NextResponse.json({
    user: { id: userId, name, email },
  });
}
