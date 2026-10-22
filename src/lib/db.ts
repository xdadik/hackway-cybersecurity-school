import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/**
 * Server-side data store for Hackway Academy.
 *
 * SQLite (via better-sqlite3) is used as the source of truth for course
 * catalogue data, accounts, enrollments and lesson progress. Set
 * HACKWAY_DB_PATH to point at a different file (for example a libSQL/Turso
 * location in a serverless deployment).
 */

const DB_PATH =
  process.env.HACKWAY_DB_PATH ?? path.join(process.cwd(), "data", "hackway.db");

let connection: Database.Database | null = null;

function openConnection(): Database.Database {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

export function getDb(): Database.Database {
  if (!connection) {
    connection = openConnection();
  }
  return connection;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id             TEXT PRIMARY KEY,
      name           TEXT NOT NULL,
      email          TEXT NOT NULL UNIQUE,
      password_hash  TEXT NOT NULL,
      accent         TEXT NOT NULL DEFAULT 'cyan',
      created_at     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at  TEXT NOT NULL,
      expires_at  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

    CREATE TABLE IF NOT EXISTS instructors (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      role          TEXT NOT NULL,
      bio           TEXT NOT NULL,
      expertise     TEXT NOT NULL,
      initials      TEXT NOT NULL,
      accent        TEXT NOT NULL DEFAULT 'cyan'
    );

    CREATE TABLE IF NOT EXISTS courses (
      id             TEXT PRIMARY KEY,
      slug           TEXT NOT NULL UNIQUE,
      title          TEXT NOT NULL,
      tagline        TEXT NOT NULL,
      description    TEXT NOT NULL,
      category       TEXT NOT NULL,
      level          TEXT NOT NULL,
      level_rank     INTEGER NOT NULL DEFAULT 1,
      thumbnail      TEXT NOT NULL,
      instructor_id  TEXT REFERENCES instructors(id) ON DELETE SET NULL,
      outcomes       TEXT NOT NULL DEFAULT '[]',
      is_demo        INTEGER NOT NULL DEFAULT 1,
      price_cents    INTEGER,
      featured       INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT NOT NULL,
      updated_at     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sections (
      id          TEXT PRIMARY KEY,
      course_id   TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      position    INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS sections_course_idx ON sections(course_id, position);

    CREATE TABLE IF NOT EXISTS lessons (
      id                   TEXT PRIMARY KEY,
      course_id            TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      section_id           TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
      title                TEXT NOT NULL,
      description          TEXT NOT NULL,
      position             INTEGER NOT NULL,
      duration_seconds     INTEGER NOT NULL,
      media_key            TEXT,
      media_duration_secs  INTEGER,
      captions_key         TEXT,
      is_preview           INTEGER NOT NULL DEFAULT 0,
      published            INTEGER NOT NULL DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS lessons_section_idx ON lessons(section_id, position);
    CREATE INDEX IF NOT EXISTS lessons_course_idx ON lessons(course_id);

    CREATE TABLE IF NOT EXISTS enrollments (
      id                    TEXT PRIMARY KEY,
      user_id               TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id             TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      status                TEXT NOT NULL DEFAULT 'active',
      enrolled_at           TEXT NOT NULL,
      last_lesson_id        TEXT REFERENCES lessons(id) ON DELETE SET NULL,
      last_position_seconds REAL NOT NULL DEFAULT 0,
      last_accessed_at      TEXT,
      completed_at          TEXT,
      UNIQUE (user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      id               TEXT PRIMARY KEY,
      user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id        TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      course_id        TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      completed        INTEGER NOT NULL DEFAULT 0,
      completed_at     TEXT,
      position_seconds REAL NOT NULL DEFAULT 0,
      watched_percent  REAL NOT NULL DEFAULT 0,
      UNIQUE (user_id, lesson_id)
    );

    CREATE INDEX IF NOT EXISTS progress_user_idx ON lesson_progress(user_id);

    CREATE TABLE IF NOT EXISTS applications (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL,
      course      TEXT NOT NULL,
      experience  TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'pending',
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS applications_status_created_idx
      ON applications(status, created_at DESC);

    CREATE TABLE IF NOT EXISTS telegram_admins (
      user_id     TEXT PRIMARY KEY,
      added_at    TEXT NOT NULL
    );
  `);

  // Lightweight forward-compatible migrations for databases created by an
  // earlier version of the schema.
  const columns = db
    .prepare("PRAGMA table_info(enrollments)")
    .all() as { name: string }[];
  if (!columns.some((column) => column.name === "last_accessed_at")) {
    db.exec("ALTER TABLE enrollments ADD COLUMN last_accessed_at TEXT");
  }
}

export function nowIso() {
  return new Date().toISOString();
}
