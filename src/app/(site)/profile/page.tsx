import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import { ProfileForm, SignOutButton } from "@/components/profile/ProfileForm";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getCurrentUser } from "@/lib/auth";
import { getLessonCounts, listEnrollments } from "@/lib/repo/learning";
import { formatDate, formatRuntime, initialsFromName } from "@/lib/format";

export const metadata: Metadata = {
  title: "Profile & settings",
  description: "Manage your Hackway Academy account.",
};

export default function ProfilePage() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/signin?next=/profile");
  }

  const enrollments = listEnrollments(user.id);
  const counts = getLessonCounts(user.id);
  const completed = enrollments.filter((item) => item.isComplete);

  return (
    <div className="border-b border-line">
      <div className="container-page py-14 lg:py-16">
        <header className="max-w-2xl">
          <p className="eyebrow">Account</p>
          <h1 className="heading-lg mt-4">Profile &amp; settings</h1>
          <p className="body-lg mt-4">
            Your account details, enrolled courses and progress summary.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
            <section
              aria-labelledby="identity-heading"
              className="surface-card p-6"
            >
              <h2 id="identity-heading" className="heading-md">
                Account details
              </h2>

              <div className="mt-5 flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-center">
                <Avatar
                  initials={initialsFromName(user.name)}
                  accent={user.accent}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="text-[1.125rem] font-semibold text-ink">
                    {user.name}
                  </p>
                  <p className="mt-1 text-[0.9375rem] text-ink-secondary">
                    {user.email}
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-ink-muted">
                    Account created {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <ProfileForm name={user.name} />
              </div>
            </section>

            <section
              aria-labelledby="courses-heading"
              className="surface-card p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="courses-heading" className="heading-md">
                  Enrolled courses
                </h2>
                <Link href="/my-learning" className="link-underline text-[0.875rem]">
                  Open My Learning
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-line bg-canvas-secondary/40 px-4 py-6 text-center text-[0.9375rem] text-ink-secondary">
                  You have not enrolled in a course yet.
                </p>
              ) : (
                <ul className="mt-5 divide-y divide-line">
                  {enrollments.map((course) => (
                    <li
                      key={course.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <img
                          src={course.thumbnail}
                          alt=""
                          width={160}
                          height={90}
                          className="h-12 w-[86px] shrink-0 rounded-md border border-line object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[0.9375rem] font-medium text-ink">
                            {course.title}
                          </p>
                          <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                            {course.completedLessons} of {course.totalLessons}{" "}
                            lessons · {formatRuntime(course.totalDurationSeconds)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:w-52">
                        <ProgressBar
                          value={course.progressPercent}
                          label={`${course.title} progress`}
                          size="sm"
                        />
                        <span className="w-10 shrink-0 text-right font-mono text-[0.75rem] text-ink-muted">
                          {course.progressPercent}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="surface-card p-6">
              <h2 className="text-[0.9375rem] font-semibold text-ink">
                Learning summary
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-[0.875rem] text-ink-secondary">
                    <BookOpen className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    Enrolled courses
                  </dt>
                  <dd className="font-mono text-[0.9375rem] font-medium text-ink">
                    {counts.enrolledCourses}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-[0.875rem] text-ink-secondary">
                    <CheckCircle2 className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    Completed courses
                  </dt>
                  <dd className="font-mono text-[0.9375rem] font-medium text-ink">
                    {counts.completedCourses}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-[0.875rem] text-ink-secondary">
                    <GraduationCap className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    Lessons completed
                  </dt>
                  <dd className="font-mono text-[0.9375rem] font-medium text-ink">
                    {counts.lessonsCompleted}
                  </dd>
                </div>
              </dl>

              {completed.length > 0 ? (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    Completed
                  </p>
                  <ul className="mt-2.5 space-y-1.5">
                    {completed.map((course) => (
                      <li key={course.id} className="text-[0.8125rem] text-ink-secondary">
                        {course.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section className="surface-card p-6">
              <h2 className="text-[0.9375rem] font-semibold text-ink">Session</h2>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-secondary">
                You are signed in on this device. Signing out ends the session on
                this browser.
              </p>
              <div className="mt-4">
                <SignOutButton />
              </div>
            </section>

            <section className="surface-card p-6">
              <h2 className="text-[0.9375rem] font-semibold text-ink">
                Preferences
              </h2>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-[0.8125rem] text-ink-secondary">
                    Interface language
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge tone="neutral">English</Badge>
                    <span className="text-[0.75rem] text-ink-muted">
                      Only English is available at present.
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[0.8125rem] text-ink-secondary">
                    Profile visibility
                  </p>
                  <p className="mt-1 text-[0.75rem] text-ink-muted">
                    Your profile is private. Other students cannot view your
                    details.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
