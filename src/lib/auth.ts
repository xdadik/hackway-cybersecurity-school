import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb, nowIso } from "@/lib/db";
import { ensureSeeded, ensureDemoAccount } from "@/lib/seed";
import { hashPassword, verifyPassword } from "@/lib/password";

export const SESSION_COOKIE = "hackway_session";
const SESSION_TTL_DAYS = 30;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  accent: string;
  createdAt: string;
}

export interface InstructorRecord {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  initials: string;
  accent: string;
}

export function findUserByEmail(email: string) {
  ensureSeeded();
  ensureDemoAccount();
  return getDb()
    .prepare(
      `SELECT id, name, email, password_hash, accent, created_at
       FROM users WHERE email = ?`
    )
    .get(email.trim().toLowerCase()) as
    | {
        id: string;
        name: string;
        email: string;
        password_hash: string;
        accent: string;
        created_at: string;
      }
    | undefined;
}

export function createUser(name: string, email: string, password: string) {
  ensureSeeded();
  ensureDemoAccount();
  const id = `usr-${randomBytes(8).toString("hex")}`;
  const accents = ["cyan", "blue", "lavender"];
  const accent = accents[Math.floor(Math.random() * accents.length)];

  getDb()
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, accent, created_at)
       VALUES (@id, @name, @email, @password_hash, @accent, @created_at)`
    )
    .run({
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: hashPassword(password),
      accent,
      created_at: nowIso(),
    });

  return id;
}

export function authenticate(email: string, password: string): SessionUser | null {
  const record = findUserByEmail(email);
  if (!record) return null;
  if (!verifyPassword(password, record.password_hash)) return null;

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    accent: record.accent,
    createdAt: record.created_at,
  };
}

export function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const createdAt = nowIso();
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  getDb()
    .prepare(
      `INSERT INTO sessions (id, user_id, created_at, expires_at)
       VALUES (@id, @user_id, @created_at, @expires_at)`
    )
    .run({ id: token, user_id: userId, created_at: createdAt, expires_at: expiresAt });

  return { token, expiresAt };
}

export function setSessionCookie(token: string, expiresAt: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function destroySession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(token);
}

export function getCurrentUser(): SessionUser | null {
  ensureSeeded();
  ensureDemoAccount();

  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, u.accent, u.created_at, s.expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`
    )
    .get(token) as
    | {
        id: string;
        name: string;
        email: string;
        accent: string;
        created_at: string;
        expires_at: string;
      }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    destroySession(token);
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    accent: row.accent,
    createdAt: row.created_at,
  };
}

export function updateUserProfile(userId: string, name: string) {
  getDb().prepare("UPDATE users SET name = ? WHERE id = ?").run(name.trim(), userId);
}
