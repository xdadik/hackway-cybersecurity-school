import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PlayCircle } from "lucide-react";
import { MyLearningGrid } from "@/components/learning/MyLearningGrid";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";
import { listEnrollments } from "@/lib/repo/learning";
import { formatRelative, formatRuntime } from "@/lib/format";

export const metadata: Metadata = {
  title: "My Learning",
  description: "Continue your courses and keep track of your progress.",
};

export default function MyLearningPage() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/signin?next=/my-learning");
  }

  const enrollments = listEnrollments(user.id);
  const recent = enrollments[0] ?? null;

  const cards = enrollments.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    thumbnail: course.thumbnail,
    category: course.category,
    level: course.level,
    lessonCount: course.lessonCount,
    totalDurationSeconds: course.totalDurationSeconds,
    progressPercent: course.progressPercent,
    completedLessons: course.completedLessons,
    totalLessons: course.totalLessons,
    lastLessonId: course.lastLessonId,
    isComplete: course.isComplete,
  }));

  return (
    <div className="border-b border-line">
      <div className="container-page py-14 lg:py-16">
        <header className="max-w-2xl">
          <p className="eyebrow">My Learning</p>
          <h1 className="heading-lg mt-4">My Learning</h1>
          <p className="body-lg mt-4">
            Continue your courses and keep track of your progress.
          </p>
          <p className="mt-3 text-[0.9375rem] text-ink-secondary">
            Welcome back, {user.name.split(" ")[0]}.
          </p>
        </header>

        {enrollments.length === 0 ? (
          <EmptyState
            className="mt-10"
            icon={<PlayCircle className="h-5 w-5" aria-hidden="true" />}
            title="Your Learning Journey Starts Here"
            description="Explore the academy and choose your first course."
            action={
              <ButtonLink href="/courses">
                Explore Courses
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            }
          />
        ) : (
          <>
            {recent ? (
              <section
                aria-labelledby="continue-heading"
                className="mt-10 overflow-hidden rounded-xl border border-line bg-surface"
              >
                <div className="grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <Link
                    href={`/courses/${recent.slug}`}
                    className="relative block aspect-video overflow-hidden border-b border-line bg-canvas-secondary md:aspect-auto md:h-full md:border-b-0 md:border-r"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      src={recent.thumbnail}
                      alt=""
                      width={1280}
                      height={720}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="acid">Continue learning</Badge>
                      <Badge tone="muted">{recent.category}</Badge>
                    </div>

                    <h2
                      id="continue-heading"
                      className="mt-4 text-[1.375rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]"
                    >
                      {recent.title}
                    </h2>

                    {recent.lastLessonTitle ? (
                      <p className="mt-2 text-[0.9375rem] text-ink-secondary">
                        Last lesson:{" "}
                        <span className="text-ink">{recent.lastLessonTitle}</span>
                        {recent.lastLessonSectionTitle ? (
                          <span className="text-ink-muted">
                            {" "}
                            · {recent.lastLessonSectionTitle}
                          </span>
                        ) : null}
                      </p>
                    ) : (
                      <p className="mt-2 text-[0.9375rem] text-ink-secondary">
                        You have not started a lesson yet.
                      </p>
                    )}

                    <div className="mt-6 max-w-md">
                      <ProgressBar
                        value={recent.progressPercent}
                        label="Course progress"
                        showValue
                      />
                      <p className="mt-1.5 text-[0.75rem] text-ink-muted">
                        {recent.completedLessons} of {recent.totalLessons} lessons
                        completed · {formatRuntime(recent.totalDurationSeconds)}{" "}
                        of curriculum
                        {recent.lastAccessedAt
                          ? ` · last opened ${formatRelative(recent.lastAccessedAt)}`
                          : ""}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <ButtonLink
                        href={
                          recent.lastLessonId
                            ? `/learn/${recent.slug}/${recent.lastLessonId}`
                            : `/courses/${recent.slug}`
                        }
                      >
                        <PlayCircle className="h-4 w-4" aria-hidden="true" />
                        Continue Learning
                      </ButtonLink>
                      <ButtonLink href={`/courses/${recent.slug}`} variant="secondary">
                        View course details
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <section aria-labelledby="enrolled-heading" className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="enrolled-heading" className="heading-md">
                    Your courses
                  </h2>
                  <p className="mt-2 text-[0.9375rem] text-ink-secondary">
                    {enrollments.length}{" "}
                    {enrollments.length === 1 ? "course" : "courses"} enrolled
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <MyLearningGrid courses={cards} />
              </div>
            </section>
          </>
        )}

        <p className="mt-12 text-[0.8125rem] text-ink-muted">
          Looking for something new?{" "}
          <Link href="/courses" className="link-underline">
            Browse the full catalogue
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
