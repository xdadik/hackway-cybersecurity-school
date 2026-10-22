"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  PartyPopper,
} from "lucide-react";
import { LearningHeader } from "@/components/learning/LearningHeader";
import { VideoPlayer } from "@/components/learning/VideoPlayer";
import { LessonSidebar } from "@/components/learning/LessonSidebar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatClock } from "@/lib/format";
import type { SessionUser } from "@/lib/auth";

export interface LearningLesson {
  id: string;
  title: string;
  description?: string;
  durationSeconds: number;
  isPreview: boolean;
}

export interface LearningSection {
  id: string;
  title: string;
  position: number;
  lessons: LearningLesson[];
}

export function LearningView({
  course,
  lesson,
  section,
  sections,
  previous,
  next,
  completedLessonIds,
  totalLessons,
  progressPercent,
  initialPositionSeconds,
  isEnrolled,
  isAuthenticated,
  canPlay,
  user,
}: {
  course: { slug: string; title: string; thumbnail: string };
  lesson: LearningLesson;
  section: { position: number; title: string } | null;
  sections: LearningSection[];
  previous: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  completedLessonIds: string[];
  totalLessons: number;
  progressPercent: number;
  initialPositionSeconds: number;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  canPlay: boolean;
  user: SessionUser | null;
}) {
  const router = useRouter();
  const { notify } = useToast();

  const [completed, setCompleted] = useState(
    completedLessonIds.includes(lesson.id)
  );
  const [completedSet, setCompletedSet] = useState(
    () => new Set(completedLessonIds)
  );
  const [progress, setProgress] = useState(progressPercent);
  const [pending, setPending] = useState(false);

  const saveProgress = useCallback(
    async (payload: { completed?: boolean; positionSeconds?: number; watchedPercent?: number }) => {
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id, ...payload }),
        });
        if (!response.ok) return null;
        return await response.json();
      } catch {
        return null;
      }
    },
    [lesson.id]
  );

  const toggleComplete = async () => {
    if (!isEnrolled) {
      notify("Enrol in the course to record your progress.", "error");
      return;
    }
    setPending(true);
    const next = !completed;
    const result = await saveProgress({ completed: next });

    if (!result) {
      notify("Your progress could not be saved. Please try again.", "error");
      setPending(false);
      return;
    }

    setCompleted(next);
    setCompletedSet((current) => {
      const updated = new Set(current);
      if (next) updated.add(lesson.id);
      else updated.delete(lesson.id);
      return updated;
    });

    if (result.progress) {
      setProgress(result.progress.progressPercent);
    }

    notify(
      next ? "Lesson marked as completed." : "Lesson marked as incomplete.",
      "success"
    );
    setPending(false);
    router.refresh();
  };

  const handleEnded = async () => {
    if (completed || !isEnrolled) return;
    const result = await saveProgress({ completed: true });
    if (result?.progress) {
      setCompleted(true);
      setCompletedSet((current) => new Set(current).add(lesson.id));
      setProgress(result.progress.progressPercent);
      notify("Lesson completed. Next lesson is ready when you are.", "success");
      router.refresh();
    }
  };

  const handlePositionSave = useCallback(
    (positionSeconds: number, watchedPercent: number) => {
      void saveProgress({ positionSeconds, watchedPercent });
    },
    [saveProgress]
  );

  const courseFinished = progress >= 100;

  return (
    <div className="min-h-screen bg-canvas">
      <LearningHeader
        courseTitle={course.title}
        courseSlug={course.slug}
        progressPercent={progress}
        user={user}
      />

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-8 lg:py-8">
        <div className="min-w-0">
          {canPlay ? (
            <VideoPlayer
              key={lesson.id}
              lessonId={lesson.id}
              title={lesson.title}
              poster={course.thumbnail}
              hasCaptions
              initialPositionSeconds={initialPositionSeconds}
              onEnded={handleEnded}
              onPositionSave={handlePositionSave}
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-line bg-canvas-secondary px-6 text-center">
              <Lock className="h-6 w-6 text-ink-muted" aria-hidden="true" />
              <p className="text-[0.9375rem] font-medium text-ink">
                This lesson is available to enrolled students
              </p>
              <p className="max-w-md text-[0.875rem] leading-relaxed text-ink-secondary">
                Enrol in {course.title} to watch the full lesson and record your
                progress.
              </p>
              <ButtonLink href={`/courses/${course.slug}`} className="mt-2">
                View course
              </ButtonLink>
            </div>
          )}

          <div className="mt-6">
            <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-acid">
              {section
                ? `Section ${String(section.position).padStart(2, "0")} · ${section.title}`
                : "Lesson"}
            </p>
            <h1 className="mt-2.5 text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.75rem]">
              {lesson.title}
            </h1>
            <p className="mt-1.5 font-mono text-[0.75rem] text-ink-muted">
              Planned length {formatClock(lesson.durationSeconds)} · sample media
              in this build
            </p>
            {lesson.description ? (
              <p className="body-base mt-4 max-w-3xl">{lesson.description}</p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant={completed ? "secondary" : "primary"}
                onClick={toggleComplete}
                disabled={pending || !isEnrolled}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                    Completed
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" aria-hidden="true" />
                    {pending ? "Saving…" : "Mark as Completed"}
                  </>
                )}
              </Button>

              <nav aria-label="Lesson navigation" className="flex items-center gap-2">
                {previous ? (
                  <ButtonLink
                    href={`/learn/${course.slug}/${previous.id}`}
                    variant="secondary"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Previous
                  </ButtonLink>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-md border border-line/60 px-3.5 text-[0.875rem] text-ink-muted/60"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Previous
                  </span>
                )}

                {next ? (
                  <ButtonLink href={`/learn/${course.slug}/${next.id}`}>
                    Next lesson
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-md border border-line/60 px-4 text-[0.875rem] text-ink-muted/60"
                  >
                    Next Lesson
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </nav>
            </div>

            {courseFinished ? (
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-success/30 bg-success/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <PartyPopper
                    className="h-5 w-5 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="text-[0.9375rem] font-semibold text-ink">
                      You have completed every lesson in this course.
                    </h2>
                    <p className="mt-1 text-[0.875rem] text-ink-secondary">
                      Your progress is saved. Pick another course whenever you are
                      ready to continue.
                    </p>
                  </div>
                </div>
                <ButtonLink href="/courses" variant="secondary" className="shrink-0">
                  Browse courses
                </ButtonLink>
              </div>
            ) : null}

            {!isEnrolled ? (
              <div className="mt-6 rounded-xl border border-line bg-surface p-5">
                <h2 className="text-[0.9375rem] font-semibold text-ink">
                  {isAuthenticated
                    ? "Enrol to unlock the full curriculum"
                    : "Sign in to continue this course"}
                </h2>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-secondary">
                  {isAuthenticated
                    ? "Progress tracking, lesson completion and saved playback positions are recorded for enrolled students."
                    : "Create an account or sign in to enrol, track your progress and resume where you stopped."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {isAuthenticated ? (
                    <ButtonLink href={`/courses/${course.slug}`}>
                      View enrolment options
                    </ButtonLink>
                  ) : (
                    <>
                      <ButtonLink
                        href={`/signin?next=/learn/${course.slug}/${lesson.id}`}
                      >
                        Sign in
                      </ButtonLink>
                      <ButtonLink href="/register" variant="secondary">
                        Create an account
                      </ButtonLink>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <LessonSidebar
          courseSlug={course.slug}
          courseTitle={course.title}
          sections={sections}
          currentLessonId={lesson.id}
          completedLessonIds={Array.from(completedSet)}
          progressPercent={progress}
          totalLessons={totalLessons}
          completedLessons={completedSet.size}
          isEnrolled={isEnrolled}
        />
      </div>
    </div>
  );
}
