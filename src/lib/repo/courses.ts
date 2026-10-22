import { getDb } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: string;
  thumbnail: string;
  instructorName: string | null;
  instructorRole: string | null;
  lessonCount: number;
  sectionCount: number;
  totalDurationSeconds: number;
  isDemo: boolean;
  priceCents: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonRecord {
  id: string;
  courseId: string;
  sectionId: string;
  title: string;
  description: string;
  position: number;
  durationSeconds: number;
  mediaKey: string | null;
  mediaDurationSeconds: number | null;
  captionsKey: string | null;
  isPreview: boolean;
  published: boolean;
}

export interface SectionRecord {
  id: string;
  courseId: string;
  title: string;
  description: string;
  position: number;
  lessons: LessonRecord[];
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

export interface CourseDetail extends CourseSummary {
  outcomes: string[];
  instructor: InstructorRecord | null;
  sections: SectionRecord[];
}

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: string;
  thumbnail: string;
  instructor_name: string | null;
  instructor_role: string | null;
  lesson_count: number;
  section_count: number;
  total_duration: number;
  is_demo: number;
  price_cents: number | null;
  featured: number;
  created_at: string;
  updated_at: string;
}

const COURSE_SELECT = `
  SELECT c.id, c.slug, c.title, c.tagline, c.description, c.category, c.level,
         c.thumbnail, c.outcomes, c.is_demo, c.price_cents, c.featured,
         c.created_at, c.updated_at,
         i.name AS instructor_name, i.role AS instructor_role,
         (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id AND l.published = 1) AS lesson_count,
         (SELECT COUNT(*) FROM sections s WHERE s.course_id = c.id) AS section_count,
         (SELECT COALESCE(SUM(l.duration_seconds), 0) FROM lessons l WHERE l.course_id = c.id AND l.published = 1) AS total_duration
  FROM courses c
  LEFT JOIN instructors i ON i.id = c.instructor_id
`;

function mapCourse(row: CourseRow): CourseSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    level: row.level,
    thumbnail: row.thumbnail,
    instructorName: row.instructor_name,
    instructorRole: row.instructor_role,
    lessonCount: row.lesson_count,
    sectionCount: row.section_count,
    totalDurationSeconds: row.total_duration,
    isDemo: row.is_demo === 1,
    priceCents: row.price_cents,
    featured: row.featured === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listCourses(): CourseSummary[] {
  ensureSeeded();
  const rows = getDb()
    .prepare(`${COURSE_SELECT} ORDER BY c.level_rank ASC, c.created_at ASC`)
    .all() as CourseRow[];
  return rows.map(mapCourse);
}

export function listFeaturedCourses(limit = 6): CourseSummary[] {
  ensureSeeded();
  const rows = getDb()
    .prepare(`${COURSE_SELECT} WHERE c.featured = 1 ORDER BY c.created_at ASC LIMIT ?`)
    .all(limit) as CourseRow[];
  return rows.map(mapCourse);
}

export function getCourseBySlug(slug: string): CourseDetail | null {
  ensureSeeded();
  const row = getDb()
    .prepare(`${COURSE_SELECT} WHERE c.slug = ?`)
    .get(slug) as (CourseRow & { outcomes: string }) | undefined;
  if (!row) return null;

  const instructorRow = getDb()
    .prepare(
      `SELECT id, name, role, bio, expertise, initials, accent
       FROM instructors WHERE id = (SELECT instructor_id FROM courses WHERE id = ?)`
    )
    .get(row.id) as
    | {
        id: string;
        name: string;
        role: string;
        bio: string;
        expertise: string;
        initials: string;
        accent: string;
      }
    | undefined;

  const sectionRows = getDb()
    .prepare(
      `SELECT id, course_id, title, description, position
       FROM sections WHERE course_id = ? ORDER BY position ASC`
    )
    .all(row.id) as {
    id: string;
    course_id: string;
    title: string;
    description: string;
    position: number;
  }[];

  const lessonRows = getDb()
    .prepare(
      `SELECT id, course_id, section_id, title, description, position,
              duration_seconds, media_key, media_duration_secs, captions_key,
              is_preview, published
       FROM lessons WHERE course_id = ? AND published = 1
       ORDER BY section_id, position`
    )
    .all(row.id) as {
    id: string;
    course_id: string;
    section_id: string;
    title: string;
    description: string;
    position: number;
    duration_seconds: number;
    media_key: string | null;
    media_duration_secs: number | null;
    captions_key: string | null;
    is_preview: number;
    published: number;
  }[];

  const sections: SectionRecord[] = sectionRows.map((section) => ({
    id: section.id,
    courseId: section.course_id,
    title: section.title,
    description: section.description,
    position: section.position,
    lessons: lessonRows
      .filter((lesson) => lesson.section_id === section.id)
      .map(mapLesson),
  }));

  return {
    ...mapCourse(row),
    outcomes: safeParseArray(row.outcomes),
    instructor: instructorRow
      ? {
          id: instructorRow.id,
          name: instructorRow.name,
          role: instructorRow.role,
          bio: instructorRow.bio,
          expertise: safeParseArray(instructorRow.expertise),
          initials: instructorRow.initials,
          accent: instructorRow.accent,
        }
      : null,
    sections,
  };
}

function mapLesson(row: {
  id: string;
  course_id: string;
  section_id: string;
  title: string;
  description: string;
  position: number;
  duration_seconds: number;
  media_key: string | null;
  media_duration_secs: number | null;
  captions_key: string | null;
  is_preview: number;
  published: number;
}): LessonRecord {
  return {
    id: row.id,
    courseId: row.course_id,
    sectionId: row.section_id,
    title: row.title,
    description: row.description,
    position: row.position,
    durationSeconds: row.duration_seconds,
    mediaKey: row.media_key,
    mediaDurationSeconds: row.media_duration_secs,
    captionsKey: row.captions_key,
    isPreview: row.is_preview === 1,
    published: row.published === 1,
  };
}

export function getLessonById(lessonId: string): LessonRecord | null {
  ensureSeeded();
  const row = getDb()
    .prepare(
      `SELECT id, course_id, section_id, title, description, position,
              duration_seconds, media_key, media_duration_secs, captions_key,
              is_preview, published
       FROM lessons WHERE id = ?`
    )
    .get(lessonId) as Parameters<typeof mapLesson>[0] | undefined;
  return row ? mapLesson(row) : null;
}

export interface LessonNeighbour {
  id: string;
  title: string;
}

export function getLessonNeighbours(
  courseId: string,
  lessonId: string
): { previous: LessonNeighbour | null; next: LessonNeighbour | null } {
  ensureSeeded();
  const rows = getDb()
    .prepare(
      `SELECT l.id AS id, l.title AS title
       FROM lessons l
       JOIN sections s ON s.id = l.section_id
       WHERE l.course_id = ? AND l.published = 1
       ORDER BY s.position ASC, l.position ASC`
    )
    .all(courseId) as { id: string; title: string }[];

  const index = rows.findIndex((row) => row.id === lessonId);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: index > 0 ? rows[index - 1] : null,
    next: index < rows.length - 1 ? rows[index + 1] : null,
  };
}

export function listCategories(): string[] {
  ensureSeeded();
  const rows = getDb()
    .prepare("SELECT DISTINCT category FROM courses ORDER BY category ASC")
    .all() as { category: string }[];
  return rows.map((row) => row.category);
}

function safeParseArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
