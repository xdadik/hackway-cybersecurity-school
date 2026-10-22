import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningView } from "@/components/learning/LearningView";
import { getCurrentUser } from "@/lib/auth";
import { getCourseBySlug, getLessonNeighbours } from "@/lib/repo/courses";
import {
  getCompletedLessonIds,
  getLessonPlaybackState,
  listEnrollments,
} from "@/lib/repo/learning";

export function generateMetadata({
  params,
}: {
  params: { slug: string; lessonId: string };
}): Metadata {
  const course = getCourseBySlug(params.slug);
  if (!course) return { title: "Lesson not found" };

  const lesson = course.sections
    .flatMap((section) => section.lessons)
    .find((item) => item.id === params.lessonId);

  return {
    title: lesson ? `${lesson.title} · ${course.title}` : "Lesson",
  };
}

export default function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  const lesson = course.sections
    .flatMap((section) => section.lessons)
    .find((item) => item.id === params.lessonId);
  if (!lesson) notFound();

  const section = course.sections.find((item) => item.id === lesson.sectionId) ?? null;
  const user = getCurrentUser();

  const enrollment = user
    ? listEnrollments(user.id).find((item) => item.id === course.id) ?? null
    : null;
  const isEnrolled = Boolean(enrollment);

  const completedLessonIds = user
    ? Array.from(getCompletedLessonIds(user.id, course.id))
    : [];
  const playback = user
    ? getLessonPlaybackState(user.id, lesson.id)
    : { positionSeconds: 0, completed: false, watchedPercent: 0 };

  const { previous, next } = getLessonNeighbours(course.id, lesson.id);

  return (
    <LearningView
      course={{
        slug: course.slug,
        title: course.title,
        thumbnail: course.thumbnail,
      }}
      lesson={{
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        durationSeconds: lesson.durationSeconds,
        isPreview: lesson.isPreview,
      }}
      section={
        section ? { position: section.position, title: section.title } : null
      }
      sections={course.sections.map((item) => ({
        id: item.id,
        title: item.title,
        position: item.position,
        lessons: item.lessons.map((item2) => ({
          id: item2.id,
          title: item2.title,
          durationSeconds: item2.durationSeconds,
          isPreview: item2.isPreview,
        })),
      }))}
      previous={previous}
      next={next}
      completedLessonIds={completedLessonIds}
      totalLessons={course.lessonCount}
      progressPercent={
        enrollment?.progressPercent ??
        (course.lessonCount > 0
          ? Math.round((completedLessonIds.length / course.lessonCount) * 100)
          : 0)
      }
      initialPositionSeconds={playback.positionSeconds}
      isEnrolled={isEnrolled}
      isAuthenticated={Boolean(user)}
      canPlay={isEnrolled || lesson.isPreview}
      user={user}
    />
  );
}
