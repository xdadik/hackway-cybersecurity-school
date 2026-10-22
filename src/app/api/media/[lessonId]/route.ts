import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getLessonById } from "@/lib/repo/courses";
import { isEnrolled } from "@/lib/repo/learning";

export const runtime = "nodejs";

const MEDIA_ROOT = process.env.HACKWAY_MEDIA_DIR ?? path.join(process.cwd(), "media", "videos");

/**
 * Streams lesson media from the private media directory.
 *
 * The file never lives in /public: access is checked on the server for every
 * request, and HTTP range requests are supported so the browser can seek.
 */
export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  const lesson = getLessonById(params.lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  if (!lesson.mediaKey) {
    return NextResponse.json(
      { error: "No media has been uploaded for this lesson yet." },
      { status: 404 }
    );
  }

  if (!lesson.isPreview) {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sign in to watch this lesson." },
        { status: 401 }
      );
    }
    if (!isEnrolled(user.id, lesson.courseId)) {
      return NextResponse.json(
        { error: "Enrol in this course to watch the full lesson." },
        { status: 403 }
      );
    }
  }

  const filePath = path.join(MEDIA_ROOT, `${lesson.mediaKey}.mp4`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "The media file for this lesson is not available." },
      { status: 404 }
    );
  }

  const { size } = fs.statSync(filePath);
  const rangeHeader = request.headers.get("range");

  if (!rangeHeader) {
    const stream = fs.createReadStream(filePath);
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  }

  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!match) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const chunk = fs.createReadStream(filePath, { start, end });

  return new Response(Readable.toWeb(chunk) as ReadableStream, {
    status: 206,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
