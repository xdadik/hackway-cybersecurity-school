"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { ButtonLink } from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth";

export function LearningHeader({
  courseTitle,
  courseSlug,
  progressPercent,
  user,
}: {
  courseTitle: string;
  courseSlug: string;
  progressPercent: number;
  user: SessionUser | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6">
        <Logo />

        <span className="h-5 w-px bg-line" aria-hidden="true" />

        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex min-w-0 items-center gap-2 rounded-md text-ink-secondary transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden truncate text-[0.875rem] sm:inline">{courseTitle}</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden w-40 md:block">
            <ProgressBar value={progressPercent} label="Course progress" size="sm" />
            <p className="mt-1 text-right text-[0.6875rem] text-ink-muted">
              {progressPercent}% complete
            </p>
          </div>

          {user ? (
            <AccountMenu user={user} fullItems={false} />
          ) : (
            <ButtonLink href="/signin" variant="secondary" size="sm">
              Sign in
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}
