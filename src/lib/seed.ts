import { getDb, nowIso } from "@/lib/db";
import { COURSES, INSTRUCTORS } from "@/lib/content/catalog";
import { hashPassword } from "@/lib/password";

export const DEMO_ACCOUNT = {
  email: "demo@hackway.academy",
  password: "HackwayDemo2026",
  name: "Demo Student",
};

export function ensureSeeded() {
  const db = getDb();

  // `.immediate()` takes a write lock before checking, so parallel build
  // workers cannot seed the catalogue twice at the same time.
  const seedAll = db.transaction(() => {
    const existing = db
      .prepare("SELECT COUNT(*) AS count FROM courses")
      .get() as { count: number };
    if (existing.count > 0) return;

    const insertInstructor = db.prepare(`
    INSERT OR IGNORE INTO instructors (id, name, role, bio, expertise, initials, accent)
    VALUES (@id, @name, @role, @bio, @expertise, @initials, @accent)
  `);

    const insertCourse = db.prepare(`
    INSERT OR IGNORE INTO courses (
      id, slug, title, tagline, description, category, level, level_rank,
      thumbnail, instructor_id, outcomes, is_demo, price_cents, featured,
      created_at, updated_at
    ) VALUES (
      @id, @slug, @title, @tagline, @description, @category, @level, @level_rank,
      @thumbnail, @instructor_id, @outcomes, @is_demo, @price_cents, @featured,
      @created_at, @updated_at
    )
  `);

    const insertSection = db.prepare(`
    INSERT OR IGNORE INTO sections (id, course_id, title, description, position)
    VALUES (@id, @course_id, @title, @description, @position)
  `);

    const insertLesson = db.prepare(`
    INSERT OR IGNORE INTO lessons (
      id, course_id, section_id, title, description, position, duration_seconds,
      media_key, media_duration_secs, captions_key, is_preview, published
    ) VALUES (
      @id, @course_id, @section_id, @title, @description, @position, @duration_seconds,
      @media_key, @media_duration_secs, @captions_key, @is_preview, 1
    )
  `);

    const levelRank: Record<string, number> = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
    };

    for (const instructor of INSTRUCTORS) {
      insertInstructor.run({
        id: instructor.id,
        name: instructor.name,
        role: instructor.role,
        bio: instructor.bio,
        expertise: JSON.stringify(instructor.expertise),
        initials: instructor.initials,
        accent: instructor.accent,
      });
    }

    for (const course of COURSES) {
      insertCourse.run({
        id: course.id,
        slug: course.slug,
        title: course.title,
        tagline: course.tagline,
        description: course.description,
        category: course.category,
        level: course.level,
        level_rank: levelRank[course.level] ?? 1,
        thumbnail: course.thumbnail,
        instructor_id: course.instructorId,
        outcomes: JSON.stringify(course.outcomes),
        is_demo: course.isDemo ? 1 : 0,
        price_cents: course.priceCents,
        featured: course.featured ? 1 : 0,
        created_at: course.createdAt,
        updated_at: course.updatedAt,
      });

      course.sections.forEach((section, sectionIndex) => {
        insertSection.run({
          id: section.id,
          course_id: course.id,
          title: section.title,
          description: section.description,
          position: sectionIndex + 1,
        });

        section.lessons.forEach((lesson, lessonIndex) => {
          insertLesson.run({
            id: lesson.id,
            course_id: course.id,
            section_id: section.id,
            title: lesson.title,
            description: lesson.description,
            position: lessonIndex + 1,
            duration_seconds: lesson.durationSeconds,
            media_key: lesson.mediaKey,
            media_duration_secs: null,
            captions_key: null,
            is_preview: lesson.isPreview ? 1 : 0,
          });
        });
      });
    }
  });

  seedAll.immediate();
}

export function ensureDemoAccount() {
  const db = getDb();

  // Fast path: the account already exists, so skip the (deliberately slow)
  // password hashing on every request.
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(DEMO_ACCOUNT.email.toLowerCase());
  if (existing) return;

  const insertDemo = db.transaction(() => {
    db.prepare(
      `INSERT OR IGNORE INTO users (id, name, email, password_hash, accent, created_at)
       VALUES (@id, @name, @email, @password_hash, @accent, @created_at)`
    ).run({
      id: "usr-demo",
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email.toLowerCase(),
      password_hash: hashPassword(DEMO_ACCOUNT.password),
      accent: "cyan",
      created_at: nowIso(),
    });
  });

  insertDemo.immediate();
}
