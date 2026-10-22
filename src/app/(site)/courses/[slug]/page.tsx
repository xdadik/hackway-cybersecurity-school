import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Layers, ShieldCheck, User } from "lucide-react";
import { EnrollmentCard } from "@/components/course/EnrollmentCard";
import { Curriculum } from "@/components/course/Curriculum";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { getCurrentUser } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/repo/courses";
import { getCompletedLessonIds, listEnrollments } from "@/lib/repo/learning";
import { formatDate, formatRuntime } from "@/lib/format";

export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const course = getCourseBySlug(params.slug);
  if (!course) {
    return { title: "Course not found" };
  }
  return {
    title: course.title,
    description: course.description,
  };
}

export default function CourseDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  const user = getCurrentUser();
  const enrollment = user
    ? listEnrollments(user.id).find((item) => item.id === course.id) ?? null
    : null;

  const completedLessonIds = user
    ? Array.from(getCompletedLessonIds(user.id, course.id))
    : [];

  const firstLesson =
    course.sections[0]?.lessons.find((lesson) => lesson.isPreview) ??
    course.sections[0]?.lessons[0] ??
    null;

  return (
    <div className="border-b border-line">
      <div className="container-page py-10 lg:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-ink-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/courses" className="transition-colors hover:text-ink">
                Courses
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-ink-secondary">
              {course.title}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="acid">{course.category}</Badge>
              <DifficultyBadge level={course.level} />
              {course.isDemo ? <Badge tone="muted">Demo content</Badge> : null}
            </div>

            <h1 className="heading-lg mt-5">{course.title}</h1>
            <p className="body-lg mt-4 max-w-2xl">{course.description}</p>

            <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.8125rem] text-ink-secondary">
              {course.instructorName ? (
                <li className="inline-flex items-center gap-2">
                  <User className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                  {course.instructorName}
                </li>
              ) : null}
              <li className="inline-flex items-center gap-2">
                <Layers className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                {course.lessonCount} video lessons
              </li>
              <li className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                {formatRuntime(course.totalDurationSeconds)} of curriculum
              </li>
              <li className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                {course.sectionCount} sections
              </li>
            </ul>

            <div className="mt-9 overflow-hidden border-2 border-line">
              <img
                src={course.thumbnail}
                alt={`Course artwork for ${course.title}`}
                width={1280}
                height={720}
                className="h-auto w-full"
              />
            </div>

            <section className="mt-12" aria-labelledby="overview-heading">
              <h2 id="overview-heading" className="heading-md">
                Course overview
              </h2>
              <div className="mt-4 space-y-4">
                <p className="body-base">{course.description}</p>
                <p className="body-base">{course.tagline}</p>
              </div>
            </section>

            {course.outcomes.length > 0 ? (
              <section className="mt-12" aria-labelledby="outcomes-heading">
                <h2 id="outcomes-heading" className="heading-md">
                  What you&apos;ll learn
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {course.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex gap-3 border border-line bg-surface px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink-secondary"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-acid"
                        aria-hidden="true"
                      />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="mt-12" aria-labelledby="curriculum-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="curriculum-heading" className="heading-md">
                    Course curriculum
                  </h2>
                  <p className="mt-2 text-[0.9375rem] text-ink-secondary">
                    {course.sectionCount} sections · {course.lessonCount} video
                    lessons · {formatRuntime(course.totalDurationSeconds)}
                  </p>
                </div>
                <p className="text-[0.75rem] text-ink-muted">
                  Lengths reflect the planned curriculum; sample media is used in
                  the player.
                </p>
              </div>

              <div className="mt-6">
                <Curriculum
                  slug={course.slug}
                  sections={course.sections}
                  isEnrolled={Boolean(enrollment)}
                  completedLessonIds={completedLessonIds}
                  totalLessons={course.lessonCount}
                />
              </div>
            </section>

            {course.instructor ? (
              <section className="mt-12" aria-labelledby="instructor-heading">
                <h2 id="instructor-heading" className="heading-md">
                  Your instructor
                </h2>
                <div className="mt-5 flex flex-col gap-5 border-2 border-line bg-surface p-6 sm:flex-row">
                  <Avatar
                    initials={course.instructor.initials}
                    accent={course.instructor.accent}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <p className="text-[1.0625rem] font-semibold text-ink">
                      {course.instructor.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-acid">
                      {course.instructor.role}
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-secondary">
                      {course.instructor.bio}
                    </p>
                    {course.instructor.expertise.length > 0 ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {course.instructor.expertise.map((item) => (
                          <li key={item}>
                            <Badge tone="neutral">{item}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            <p className="mt-10 text-[0.8125rem] text-ink-muted">
              Last updated {formatDate(course.updatedAt)}.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <EnrollmentCard
              courseId={course.id}
              slug={course.slug}
              thumbnail={course.thumbnail}
              lessonCount={course.lessonCount}
              totalDurationSeconds={course.totalDurationSeconds}
              level={course.level}
              priceCents={course.priceCents}
              isAuthenticated={Boolean(user)}
              firstLessonId={firstLesson?.id ?? null}
              enrollment={
                enrollment
                  ? {
                      enrolled: true,
                      progressPercent: enrollment.progressPercent,
                      completedLessons: enrollment.completedLessons,
                      totalLessons: enrollment.totalLessons,
                      lastLessonId: enrollment.lastLessonId,
                    }
                  : null
              }
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
