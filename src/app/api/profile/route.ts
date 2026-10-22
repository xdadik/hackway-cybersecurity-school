import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { getCurrentUser, updateUserProfile } from "@/lib/auth";

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user) {
    return jsonError("Sign in to update your profile.", 401);
  }

  const payload = await readJson<{ name?: string }>(request);
  const name = (payload?.name ?? "").trim();

  if (name.length < 2) {
    return jsonError("Enter a display name of at least two characters.", 422);
  }
  if (name.length > 80) {
    return jsonError("Display names are limited to 80 characters.", 422);
  }

  updateUserProfile(user.id, name);

  return NextResponse.json({ ok: true, name });
}
