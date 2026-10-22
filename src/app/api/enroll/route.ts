import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { listCourses } from "@/lib/repo/courses";
import { enrollUser, isEnrolled } from "@/lib/repo/learning";

interface EnrollPayload {
  courseId?: string;
  slug?: string;
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user) {
    return jsonError("Sign in to enrol in a course.", 401);
  }

  const payload = await readJson<EnrollPayload>(request);
  if (!payload) return jsonError("Invalid request body.", 400);

  const course = listCourses().find(
    (candidate) =>
      candidate.id === payload.courseId || candidate.slug === payload.slug
  );
  if (!course) return jsonError("Course not found.", 404);

  if (course.priceCents !== null) {
    // A payment provider must be configured before a priced course can be
    // purchased. We never simulate a successful transaction.
    if (!process.env.PAYMENT_PROVIDER_SECRET) {
      return jsonError(
        "This course is paid and no payment provider is configured, so no purchase can be completed.",
        402,
        { code: "payment_provider_not_configured", priceCents: course.priceCents }
      );
    }
  }

  if (!isEnrolled(user.id, course.id)) {
    enrollUser(user.id, course.id);
  }

  return NextResponse.json({ ok: true, courseId: course.id, slug: course.slug });
}
