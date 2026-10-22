import { randomUUID } from "node:crypto";
import { getDb, nowIso } from "@/lib/db";

export type ApplicationStatus = "pending" | "accepted" | "declined";

export interface ApplicationRecord {
  id: string;
  name: string;
  phone: string;
  course: string;
  experience: string;
  status: ApplicationStatus;
  createdAt: string;
}

interface ApplicationRow {
  id: string;
  name: string;
  phone: string;
  course: string;
  experience: string;
  status: ApplicationStatus;
  created_at: string;
}

function mapApplication(row: ApplicationRow): ApplicationRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    course: row.course,
    experience: row.experience,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function createApplication(input: Omit<ApplicationRecord, "id" | "status" | "createdAt">) {
  const db = getDb();
  const id = randomUUID();
  const createdAt = nowIso();
  db.prepare(
    `INSERT INTO applications (id, name, phone, course, experience, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).run(id, input.name, input.phone, input.course, input.experience, createdAt, createdAt);
  return getApplication(id);
}

export function getApplication(id: string): ApplicationRecord | null {
  const row = getDb()
    .prepare("SELECT id, name, phone, course, experience, status, created_at FROM applications WHERE id = ?")
    .get(id) as ApplicationRow | undefined;
  return row ? mapApplication(row) : null;
}

export function listApplications(status?: ApplicationStatus, limit = 20): ApplicationRecord[] {
  const rows = status
    ? (getDb()
        .prepare("SELECT id, name, phone, course, experience, status, created_at FROM applications WHERE status = ? ORDER BY created_at DESC LIMIT ?")
        .all(status, limit) as ApplicationRow[])
    : (getDb()
        .prepare("SELECT id, name, phone, course, experience, status, created_at FROM applications ORDER BY created_at DESC LIMIT ?")
        .all(limit) as ApplicationRow[]);
  return rows.map(mapApplication);
}

export function countApplicationsByStatus(): Record<ApplicationStatus, number> {
  const rows = getDb()
    .prepare("SELECT status, COUNT(*) AS count FROM applications GROUP BY status")
    .all() as { status: ApplicationStatus; count: number }[];
  return rows.reduce(
    (counts, row) => ({ ...counts, [row.status]: row.count }),
    { pending: 0, accepted: 0, declined: 0 }
  );
}

export function setApplicationStatus(id: string, status: ApplicationStatus): boolean {
  const result = getDb()
    .prepare("UPDATE applications SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, nowIso(), id);
  return result.changes > 0;
}

export function deleteApplication(id: string): boolean {
  const result = getDb().prepare("DELETE FROM applications WHERE id = ?").run(id);
  return result.changes > 0;
}

export function listAdditionalAdmins(): string[] {
  return (getDb().prepare("SELECT user_id FROM telegram_admins ORDER BY added_at ASC").all() as { user_id: string }[])
    .map((row) => row.user_id);
}

export function addAdditionalAdmin(userId: string): void {
  getDb().prepare("INSERT OR IGNORE INTO telegram_admins (user_id, added_at) VALUES (?, ?)").run(userId, nowIso());
}

export function removeAdditionalAdmin(userId: string): boolean {
  return getDb().prepare("DELETE FROM telegram_admins WHERE user_id = ?").run(userId).changes > 0;
}
