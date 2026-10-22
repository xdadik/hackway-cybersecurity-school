import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getLessonById } from "@/lib/repo/courses";
import { isEnrolled } from "@/lib/repo/learning";

export const runtime = "nodejs";

const CAPTION_ROOT =
  process.env.HACKWAY_CAPTION_DIR ?? path.join(process.cwd(), "media", "captions");

export async function GET(
  _request: Request,
  { params }: { params: { lessonId: string } }
) {
  const lesson = getLessonById(params.lessonId);
  if (!lesson || !lesson.mediaKey) {
    return NextResponse.json({ error: "Captions not found." }, { status: 404 });
  }

  if (!lesson.isPreview) {
    const user = getCurrentUser();
    if (!user || !isEnrolled(user.id, lesson.courseId)) {
      return NextResponse.json({ error: "Captions not found." }, { status: 404 });
    }
  }

  const filePath = path.join(CAPTION_ROOT, `${lesson.mediaKey}.vtt`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Captions not found." }, { status: 404 });
  }

  const body = fs.readFileSync(filePath);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vtt; charset=utf-8",
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
