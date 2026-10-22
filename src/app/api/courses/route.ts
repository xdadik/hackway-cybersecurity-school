import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getCourseBySlug, listCourses } from "@/lib/repo/courses";

export async function GET() {
  try {
    const courses = listCourses().map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      tagline: course.tagline,
      description: course.description,
      category: course.category,
      level: course.level,
      thumbnail: course.thumbnail,
      instructorName: course.instructorName,
      lessonCount: course.lessonCount,
      sectionCount: course.sectionCount,
      totalDurationSeconds: course.totalDurationSeconds,
      isDemo: course.isDemo,
      priceCents: course.priceCents,
      featured: course.featured,
      updatedAt: course.updatedAt,
      createdAt: course.createdAt,
    }));
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Failed to load courses", error);
    return jsonError("Courses could not be loaded. Please try again.", 500);
  }
}

export async function POST(request: Request) {
  const payload = await readJson<{ slug?: string }>(request);
  if (!payload?.slug) return jsonError("A course slug is required.", 400);

  const course = getCourseBySlug(payload.slug);
  if (!course) return jsonError("Course not found.", 404);

  return NextResponse.json({
    course: {
      ...course,
      instructor: course.instructor,
      sections: course.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) => ({
          ...lesson,
          mediaKey: undefined,
        })),
      })),
    },
  });
}
