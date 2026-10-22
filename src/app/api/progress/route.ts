import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getLessonById } from "@/lib/repo/courses";
import {
  isEnrolled,
  savePlaybackPosition,
  setLessonCompletion,
} from "@/lib/repo/learning";

interface ProgressPayload {
  lessonId?: string;
  completed?: boolean;
  positionSeconds?: number;
  watchedPercent?: number;
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user) {
    return jsonError("Sign in to track your progress.", 401);
  }

  const payload = await readJson<ProgressPayload>(request);
  if (!payload?.lessonId) return jsonError("A lesson id is required.", 400);

  const lesson = getLessonById(payload.lessonId);
  if (!lesson) return jsonError("Lesson not found.", 404);

  if (!isEnrolled(user.id, lesson.courseId)) {
    return jsonError("Enrol in the course to record progress for this lesson.", 403);
  }

  let result = null;

  if (typeof payload.positionSeconds === "number") {
    savePlaybackPosition(
      user.id,
      lesson.id,
      Math.max(0, payload.positionSeconds),
      Math.max(0, Math.min(100, payload.watchedPercent ?? 0))
    );
  }

  if (typeof payload.completed === "boolean") {
    result = setLessonCompletion(user.id, lesson.id, payload.completed);
  }

  return NextResponse.json({ ok: true, progress: result });
}
