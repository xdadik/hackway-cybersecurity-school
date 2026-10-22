"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Eye,
  Lock,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/format";

export interface CurriculumLesson {
  id: string;
  title: string;
  description: string;
  position: number;
  durationSeconds: number;
  isPreview: boolean;
}

export interface CurriculumSection {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: CurriculumLesson[];
}

export function Curriculum({
  slug,
  sections,
  isEnrolled,
  completedLessonIds,
  totalLessons,
}: {
  slug: string;
  sections: CurriculumSection[];
  isEnrolled: boolean;
  completedLessonIds: string[];
  totalLessons: number;
}) {
  const completed = new Set(completedLessonIds);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((section) => [section.id, true]))
  );

  const toggle = (sectionId: string) => {
    setExpanded((current) => ({ ...current, [sectionId]: !current[sectionId] }));
  };

  let lessonCounter = 0;

  return (
    <div className="overflow-hidden border-2 border-line">
      {sections.map((section) => {
        const isOpen = expanded[section.id];
        const sectionLessons = section.lessons.map((lesson) => {
          lessonCounter += 1;
          return { lesson, number: lessonCounter };
        });

        return (
          <div key={section.id} className="border-b border-line last:border-b-0">
            <button
              type="button"
              onClick={() => toggle(section.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 bg-surface/60 px-5 py-4 text-left transition-colors hover:bg-surface-elevated"
            >
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="font-mono text-[0.75rem] font-semibold tracking-[0.16em] text-acid">
                  {`${String(section.position).padStart(2, "0")}`}
                </span>
                <span className="truncate font-display text-[0.9375rem] font-extrabold uppercase tracking-[-0.01em] text-white">
                  {section.title}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[0.75rem] text-ink-muted">
                  {section.lessons.length}{" "}
                  {section.lessons.length === 1 ? "lesson" : "lessons"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-acid transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </div>
            </button>

            {isOpen ? (
              <ul className="divide-y divide-line">
                {sectionLessons.map(({ lesson, number }) => {
                  const isCompleted = completed.has(lesson.id);
                  const accessible = isEnrolled || lesson.isPreview;

                  const icon = isCompleted ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-white"
                      aria-label="Completed"
                    />
                  ) : lesson.isPreview ? (
                    <Eye className="h-4 w-4 shrink-0 text-acid" aria-hidden="true" />
                  ) : accessible ? (
                    <PlayCircle className="h-4 w-4 shrink-0 text-ink-secondary" aria-hidden="true" />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  );

                  const content = (
                    <>
                      <span className="w-6 shrink-0 font-mono text-[0.75rem] text-ink-muted">
                        {String(number).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] text-ink">
                          {lesson.title}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] text-ink-muted">
                          {lesson.isPreview
                            ? "Free preview"
                            : accessible
                              ? "Video lesson"
                              : "Enrol to unlock"}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[0.75rem] text-ink-muted">
                        {formatClock(lesson.durationSeconds)}
                      </span>
                    </>
                  );

                  return (
                    <li key={lesson.id}>
                      {accessible ? (
                        <Link
                          href={`/learn/${slug}/${lesson.id}`}
                          className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-elevated"
                        >
                          {icon}
                          {content}
                        </Link>
                      ) : (
                        <div
                          className="flex items-center gap-3 px-5 py-3.5 text-ink-muted"
                          aria-label={`${lesson.title} — enrol to unlock`}
                        >
                          {icon}
                          {content}
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

      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface/60 px-5 py-4">
        <p className="text-[0.8125rem] text-ink-muted">
          {totalLessons} video lessons · no quizzes, labs or assignments
        </p>
        <p className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-muted">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Self-paced
        </p>
      </div>
    </div>
  );
}
