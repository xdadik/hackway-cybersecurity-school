"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, Circle, Lock, PlayCircle } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/format";

export interface SidebarSection {
  id: string;
  title: string;
  position: number;
  lessons: {
    id: string;
    title: string;
    durationSeconds: number;
    isPreview: boolean;
  }[];
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  sections,
  currentLessonId,
  completedLessonIds,
  progressPercent,
  totalLessons,
  completedLessons,
  isEnrolled,
}: {
  courseSlug: string;
  courseTitle: string;
  sections: SidebarSection[];
  currentLessonId: string;
  completedLessonIds: string[];
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  isEnrolled: boolean;
}) {
  const completed = new Set(completedLessonIds);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((section) => [section.id, true]))
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentLessonId]);

  const currentSection = sections.find((section) =>
    section.lessons.some((lesson) => lesson.id === currentLessonId)
  );

  const toggle = (sectionId: string) => {
    setExpanded((current) => ({ ...current, [sectionId]: !current[sectionId] }));
  };

  const list = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-5">
        <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Course
        </p>
        <h2 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-ink">
          {courseTitle}
        </h2>

        <div className="mt-4">
          <ProgressBar
            value={progressPercent}
            label="Course progress"
            showValue
          />
          <p className="mt-2 text-[0.75rem] text-ink-muted">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
      </div>

      <nav aria-label="Course curriculum" className="flex-1 overflow-y-auto p-2">
        {sections.map((section) => {
          const isOpen = expanded[section.id];
          const sectionComplete = section.lessons.filter((lesson) =>
            completed.has(lesson.id)
          ).length;

          return (
            <div key={section.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-canvas-secondary"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[0.6875rem] font-semibold tracking-[0.16em] text-acid">
                    SECTION {String(section.position).padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.875rem] font-medium text-ink">
                    {section.title}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-[0.6875rem] text-ink-muted">
                    {sectionComplete}/{section.lessons.length}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-ink-muted transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isOpen ? (
                <ul className="mt-1 space-y-0.5">
                  {section.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isCompleted = completed.has(lesson.id);
                    const accessible = isEnrolled || lesson.isPreview;

                    return (
                      <li key={lesson.id}>
                        {accessible ? (
                          <Link
                            href={`/learn/${courseSlug}/${lesson.id}`}
                            aria-current={isCurrent ? "page" : undefined}
                            className={cn(
                              "flex items-start gap-2.5 rounded-md px-3 py-2.5 text-[0.8125rem] transition-colors",
                              isCurrent
                                ? "bg-acid/10 text-ink ring-1 ring-inset ring-acid/25"
                                : "text-ink-secondary hover:bg-canvas-secondary hover:text-ink"
                            )}
                          >
                            <span className="mt-0.5 shrink-0">
                              {isCompleted ? (
                                <CheckCircle2
                                  className="h-4 w-4 text-success"
                                  aria-label="Completed"
                                />
                              ) : isCurrent ? (
                                <PlayCircle
                                  className="h-4 w-4 text-acid"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Circle
                                  className="h-4 w-4 text-ink-muted"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  "block leading-snug",
                                  isCurrent && "font-medium"
                                )}
                              >
                                {lesson.title}
                              </span>
                              <span className="mt-1 block font-mono text-[0.6875rem] text-ink-muted">
                                {formatClock(lesson.durationSeconds)}
                              </span>
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-start gap-2.5 rounded-md px-3 py-2.5 text-[0.8125rem] text-ink-muted">
                            <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            <span className="min-w-0 flex-1">
                              <span className="block leading-snug">{lesson.title}</span>
                              <span className="mt-1 block font-mono text-[0.6875rem]">
                                {formatClock(lesson.durationSeconds)}
                              </span>
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden rounded-xl border border-line bg-surface">
          {list}
        </div>
      </aside>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-curriculum"
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-left"
        >
          <span className="min-w-0">
            <span className="block text-[0.75rem] font-medium text-ink-muted">
              {currentSection?.title ?? "Curriculum"}
            </span>
            <span className="mt-0.5 block truncate text-[0.875rem] text-ink">
              {progressPercent}% complete · {completedLessons}/{totalLessons} lessons
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4.5 w-4.5 shrink-0 text-ink-muted transition-transform",
              mobileOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {mobileOpen ? (
          <div
            id="mobile-curriculum"
            className="mt-2 max-h-[26rem] overflow-y-auto rounded-lg border border-line bg-surface"
          >
            {list}
          </div>
        ) : null}
      </div>
    </>
  );
}
