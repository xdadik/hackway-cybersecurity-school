import { randomBytes } from "node:crypto";
import { getDb, nowIso } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import type { CourseSummary } from "@/lib/repo/courses";

export interface EnrollmentCourse extends CourseSummary {
  enrolledAt: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  lastLessonId: string | null;
  lastLessonTitle: string | null;
  lastLessonSectionTitle: string | null;
  lastPositionSeconds: number;
  completedAt: string | null;
  lastAccessedAt: string | null;
  isComplete: boolean;
}

export function isEnrolled(userId: string, courseId: string): boolean {
  ensureSeeded();
  const row = getDb()
    .prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId);
  return Boolean(row);
}

export function enrollUser(userId: string, courseId: string): void {
  ensureSeeded();
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId);
  if (existing) return;

  db.prepare(
    `INSERT INTO enrollments (id, user_id, course_id, status, enrolled_at, last_position_seconds)
     VALUES (@id, @user_id, @course_id, 'active', @enrolled_at, 0)`
  ).run({
    id: `enr-${randomBytes(8).toString("hex")}`,
    user_id: userId,
    course_id: courseId,
    enrolled_at: nowIso(),
  });
}

export function listEnrollments(userId: string): EnrollmentCourse[] {
  ensureSeeded();
  const rows = getDb()
    .prepare(
      `SELECT
         c.id, c.slug, c.title, c.tagline, c.description, c.category, c.level,
         c.thumbnail, c.is_demo, c.price_cents, c.featured, c.created_at, c.updated_at,
         i.name AS instructor_name, i.role AS instructor_role,
         e.enrolled_at, e.last_lesson_id, e.last_position_seconds, e.completed_at,
         e.last_accessed_at,
         (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id AND l.published = 1) AS lesson_count,
         (SELECT COUNT(*) FROM sections s WHERE s.course_id = c.id) AS section_count,
         (SELECT COALESCE(SUM(l.duration_seconds), 0) FROM lessons l WHERE l.course_id = c.id AND l.published = 1) AS total_duration,
         (SELECT COUNT(*) FROM lesson_progress p WHERE p.user_id = e.user_id AND p.course_id = c.id AND p.completed = 1) AS completed_lessons
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       LEFT JOIN instructors i ON i.id = c.instructor_id
       WHERE e.user_id = ?
       ORDER BY COALESCE(e.last_accessed_at, e.enrolled_at) DESC`
    )
    .all(userId) as Record<string, never>[];

  return rows.map((row) => {
    const r = row as unknown as {
      id: string;
      slug: string;
      title: string;
      tagline: string;
      description: string;
      category: string;
      level: string;
      thumbnail: string;
      is_demo: number;
      price_cents: number | null;
      featured: number;
      created_at: string;
      updated_at: string;
      instructor_name: string | null;
      instructor_role: string | null;
      enrolled_at: string;
      last_lesson_id: string | null;
      last_position_seconds: number;
      completed_at: string | null;
      last_accessed_at: string | null;
      lesson_count: number;
      section_count: number;
      total_duration: number;
      completed_lessons: number;
    };

    const total = r.lesson_count || 0;
    const completed = r.completed_lessons || 0;
    const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    let lastLessonTitle: string | null = null;
    let lastLessonSectionTitle: string | null = null;
    if (r.last_lesson_id) {
      const lesson = getDb()
        .prepare(
          `SELECT l.title AS title, s.title AS section_title
           FROM lessons l JOIN sections s ON s.id = l.section_id
           WHERE l.id = ?`
        )
        .get(r.last_lesson_id) as
        | { title: string; section_title: string }
        | undefined;
      lastLessonTitle = lesson?.title ?? null;
      lastLessonSectionTitle = lesson?.section_title ?? null;
    }

    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      tagline: r.tagline,
      description: r.description,
      category: r.category,
      level: r.level,
      thumbnail: r.thumbnail,
      instructorName: r.instructor_name,
      instructorRole: r.instructor_role,
      lessonCount: total,
      sectionCount: r.section_count,
      totalDurationSeconds: r.total_duration,
      isDemo: r.is_demo === 1,
      priceCents: r.price_cents,
      featured: r.featured === 1,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      enrolledAt: r.enrolled_at,
      completedLessons: completed,
      totalLessons: total,
      progressPercent,
      lastLessonId: r.last_lesson_id,
      lastLessonTitle,
      lastLessonSectionTitle,
      lastPositionSeconds: r.last_position_seconds,
      completedAt: r.completed_at,
      lastAccessedAt: r.last_accessed_at,
      isComplete: total > 0 && completed >= total,
    } satisfies EnrollmentCourse;
  });
}

export function getCompletedLessonIds(
  userId: string,
  courseId: string
): Set<string> {
  ensureSeeded();
  const rows = getDb()
    .prepare(
      `SELECT lesson_id FROM lesson_progress
       WHERE user_id = ? AND course_id = ? AND completed = 1`
    )
    .all(userId, courseId) as { lesson_id: string }[];
  return new Set(rows.map((row) => row.lesson_id));
}

export function setLessonCompletion(
  userId: string,
  lessonId: string,
  completed: boolean
): { completed: boolean; progressPercent: number; completedLessons: number; totalLessons: number; courseCompleted: boolean } {
  ensureSeeded();
  const db = getDb();
  const lesson = db
    .prepare("SELECT id, course_id FROM lessons WHERE id = ?")
    .get(lessonId) as { id: string; course_id: string } | undefined;
  if (!lesson) {
    return {
      completed: false,
      progressPercent: 0,
      completedLessons: 0,
      totalLessons: 0,
      courseCompleted: false,
    };
  }

  const existing = db
    .prepare("SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
    .get(userId, lessonId) as { id: string } | undefined;

  const completedAt = completed ? nowIso() : null;

  if (existing) {
    db.prepare(
      `UPDATE lesson_progress
       SET completed = ?, completed_at = COALESCE(?, completed_at)
       WHERE id = ?`
    ).run(completed ? 1 : 0, completedAt, existing.id);
  } else {
    db.prepare(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, course_id, completed, completed_at, position_seconds, watched_percent)
       VALUES (@id, @user_id, @lesson_id, @course_id, @completed, @completed_at, 0, 0)`
    ).run({
      id: `prg-${randomBytes(8).toString("hex")}`,
      user_id: userId,
      lesson_id: lessonId,
      course_id: lesson.course_id,
      completed: completed ? 1 : 0,
      completed_at: completedAt,
    });
  }

  if (completed) {
    db.prepare(
      `UPDATE enrollments
       SET last_lesson_id = ?, last_position_seconds = 0, last_accessed_at = ?
       WHERE user_id = ? AND course_id = ?`
    ).run(lessonId, nowIso(), userId, lesson.course_id);
  }

  const total = (
    db
      .prepare("SELECT COUNT(*) AS count FROM lessons WHERE course_id = ? AND published = 1")
      .get(lesson.course_id) as { count: number }
  ).count;

  const completedCount = (
    db
      .prepare(
        `SELECT COUNT(*) AS count FROM lesson_progress
         WHERE user_id = ? AND course_id = ? AND completed = 1`
      )
      .get(userId, lesson.course_id) as { count: number }
  ).count;

  const progressPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const courseCompleted = total > 0 && completedCount >= total;

  db.prepare(
    `UPDATE enrollments SET completed_at = ? WHERE user_id = ? AND course_id = ?`
  ).run(courseCompleted ? nowIso() : null, userId, lesson.course_id);

  return {
    completed,
    progressPercent,
    completedLessons: completedCount,
    totalLessons: total,
    courseCompleted,
  };
}

export function savePlaybackPosition(
  userId: string,
  lessonId: string,
  positionSeconds: number,
  watchedPercent: number
): void {
  ensureSeeded();
  const db = getDb();
  const lesson = db
    .prepare("SELECT id, course_id FROM lessons WHERE id = ?")
    .get(lessonId) as { id: string; course_id: string } | undefined;
  if (!lesson) return;

  const existing = db
    .prepare("SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
    .get(userId, lessonId) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE lesson_progress SET position_seconds = ?, watched_percent = ?
       WHERE id = ?`
    ).run(positionSeconds, watchedPercent, existing.id);
  } else {
    db.prepare(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, course_id, completed, completed_at, position_seconds, watched_percent)
       VALUES (@id, @user_id, @lesson_id, @course_id, 0, NULL, @position_seconds, @watched_percent)`
    ).run({
      id: `prg-${randomBytes(8).toString("hex")}`,
      user_id: userId,
      lesson_id: lessonId,
      course_id: lesson.course_id,
      position_seconds: positionSeconds,
      watched_percent: watchedPercent,
    });
  }

  db.prepare(
    `UPDATE enrollments SET last_lesson_id = ?, last_position_seconds = ?, last_accessed_at = ?
     WHERE user_id = ? AND course_id = ?`
  ).run(lessonId, positionSeconds, nowIso(), userId, lesson.course_id);
}

export function getLessonPlaybackState(
  userId: string,
  lessonId: string
): { completed: boolean; positionSeconds: number; watchedPercent: number } {
  ensureSeeded();
  const row = getDb()
    .prepare(
      `SELECT completed, position_seconds, watched_percent FROM lesson_progress
       WHERE user_id = ? AND lesson_id = ?`
    )
    .get(userId, lessonId) as
    | { completed: number; position_seconds: number; watched_percent: number }
    | undefined;

  return {
    completed: row?.completed === 1,
    positionSeconds: row?.position_seconds ?? 0,
    watchedPercent: row?.watched_percent ?? 0,
  };
}

export function getLessonCounts(userId: string) {
  ensureSeeded();
  const row = getDb()
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ? AND completed = 1) AS lessons_completed,
         (SELECT COUNT(*) FROM enrollments WHERE user_id = ?) AS enrolled_courses,
         (SELECT COUNT(*) FROM enrollments e
            WHERE e.user_id = ?
              AND e.completed_at IS NOT NULL) AS completed_courses`
    )
    .get(userId, userId, userId) as {
    lessons_completed: number;
    enrolled_courses: number;
    completed_courses: number;
  };
  return {
    lessonsCompleted: row.lessons_completed,
    enrolledCourses: row.enrolled_courses,
    completedCourses: row.completed_courses,
  };
}
