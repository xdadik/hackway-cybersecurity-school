"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { formatRuntime } from "@/lib/format";

export interface LearningCourse {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  category: string;
  level: string;
  lessonCount: number;
  totalDurationSeconds: number;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastLessonId: string | null;
  isComplete: boolean;
}

type Filter = "all" | "in-progress" | "completed";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All Courses" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function MyLearningGrid({ courses }: { courses: LearningCourse[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = courses.filter((course) => {
    if (filter === "in-progress") {
      return !course.isComplete && course.progressPercent > 0;
    }
    if (filter === "completed") return course.isComplete;
    return true;
  });

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter enrolled courses"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={cn(
              "rounded-md border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors",
              filter === item.value
                ? "border-acid/40 bg-acid/10 text-acid"
                : "border-line text-ink-secondary hover:border-line-strong hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-canvas-secondary/40 px-6 py-10 text-center text-[0.9375rem] text-ink-secondary">
          {filter === "completed"
            ? "No completed courses yet. Finish a course and it will appear here."
            : filter === "in-progress"
              ? "You have not started any lessons yet. Open a course to begin."
              : "You are not enrolled in any courses yet."}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((course) => {
            const target = course.lastLessonId
              ? `/learn/${course.slug}/${course.lastLessonId}`
              : `/courses/${course.slug}`;

            return (
              <article
                key={course.id}
                className="surface-card surface-card-hover flex h-full flex-col overflow-hidden"
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="relative block aspect-video overflow-hidden border-b border-line bg-canvas-secondary"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={course.thumbnail}
                    alt=""
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {course.isComplete ? (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-sm border border-success/40 bg-canvas/85 px-2 py-1 text-2xs font-semibold uppercase tracking-[0.1em] text-success backdrop-blur-sm">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Completed
                    </span>
                  ) : null}
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-acid">
                    {course.category}
                  </p>
                  <h3 className="mt-2 text-[1rem] font-semibold leading-snug text-ink">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="transition-colors hover:text-acid"
                    >
                      {course.title}
                    </Link>
                  </h3>

                  <div className="mt-4">
                    <ProgressBar
                      value={course.progressPercent}
                      label={`${course.title} progress`}
                      showValue
                    />
                    <p className="mt-1.5 text-[0.75rem] text-ink-muted">
                      {course.completedLessons} of {course.totalLessons} lessons
                      completed
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-[0.75rem] text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatRuntime(course.totalDurationSeconds)}
                    </span>
                    <span>{course.lessonCount} lessons</span>
                  </div>

                  <div className="mt-5 flex-1" />

                  <Link
                    href={target}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-line-strong bg-surface-elevated text-[0.875rem] font-medium text-ink transition-colors hover:border-acid/50 hover:text-acid"
                  >
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    {course.isComplete
                      ? "Review course"
                      : course.progressPercent > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
