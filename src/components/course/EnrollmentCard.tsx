"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Lock, PlayCircle, ShieldCheck } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, formatRuntime } from "@/lib/format";

export interface EnrollmentState {
  enrolled: boolean;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastLessonId: string | null;
}

export function EnrollmentCard({
  courseId,
  slug,
  thumbnail,
  lessonCount,
  totalDurationSeconds,
  level,
  priceCents,
  isAuthenticated,
  enrollment,
  firstLessonId,
}: {
  courseId: string;
  slug: string;
  thumbnail: string;
  lessonCount: number;
  totalDurationSeconds: number;
  level: string;
  priceCents: number | null;
  isAuthenticated: boolean;
  enrollment: EnrollmentState | null;
  firstLessonId: string | null;
}) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, setPending] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  const enrolled = enrollment?.enrolled ?? false;
  const progress = enrollment?.progressPercent ?? 0;
  const hasStarted = enrolled && progress > 0;

  const targetLessonId = enrollment?.lastLessonId ?? firstLessonId;
  const continueHref =
    targetLessonId && enrolled ? `/learn/${slug}/${targetLessonId}` : `/courses/${slug}`;

  const handleEnroll = async () => {
    setPending(true);
    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentNotice(
            data.error ??
              "This course is paid and no payment provider is configured, so no purchase can be completed."
          );
          return;
        }
        notify(data.error ?? "Enrollment could not be completed.", "error");
        return;
      }

      notify("You are enrolled. The course is now in My Learning.", "success");
      router.refresh();
    } catch {
      notify("Enrollment could not be completed. Please try again.", "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="overflow-hidden border-2 border-line bg-surface">
      <div className="relative aspect-video w-full overflow-hidden border-b-2 border-line bg-canvas-secondary">
        <img
          src={thumbnail}
          alt=""
          width={1280}
          height={720}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone={priceCents === null ? "acid" : "neutral"}>
            {priceCents === null ? "Free course" : formatPrice(priceCents)}
          </Badge>
          <DifficultyBadge level={level} />
        </div>

        <dl className="mt-5 space-y-2.5 text-[0.875rem]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Video lessons</dt>
            <dd className="font-medium text-ink">{lessonCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Total runtime</dt>
            <dd className="font-medium text-ink">
              {formatRuntime(totalDurationSeconds)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Level</dt>
            <dd className="font-medium text-ink">{level}</dd>
          </div>
        </dl>

        {enrolled ? (
          <div className="mt-5 border border-line bg-surface-sunken p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink">
                {enrollment?.totalLessons && enrollment.totalLessons > 0
                  ? `${enrollment.completedLessons} of ${enrollment.totalLessons} lessons completed`
                  : "Enrolled"}
              </p>
              {enrollment && enrollment.progressPercent === 100 ? (
                <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Completed
                </span>
              ) : null}
            </div>
            <ProgressBar
              value={progress}
              label="Course progress"
              className="mt-2.5"
              showValue
            />
          </div>
        ) : null}

        <div className="mt-5 space-y-2.5">
          {!isAuthenticated ? (
            <>
              <ButtonLink href={`/signin?next=/courses/${slug}`} className="w-full">
                Sign in to enrol
              </ButtonLink>
              {firstLessonId ? (
                <ButtonLink
                  href={`/learn/${slug}/${firstLessonId}`}
                  variant="subtle"
                  className="w-full"
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  Preview the first lesson
                </ButtonLink>
              ) : null}
            </>
          ) : enrolled ? (
            <ButtonLink href={continueHref} className="w-full">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {hasStarted ? "Continue Learning" : "Start Learning"}
            </ButtonLink>
          ) : priceCents === null ? (
            <Button className="w-full" onClick={handleEnroll} disabled={pending}>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {pending ? "Enrolling…" : "Enroll in Course"}
            </Button>
          ) : (
            <Button className="w-full" onClick={handleEnroll} disabled={pending}>
              <Lock className="h-4 w-4" aria-hidden="true" />
              {pending ? "Working…" : `Enrol for ${formatPrice(priceCents)}`}
            </Button>
          )}

          {!enrolled && !isAuthenticated ? (
            <p className="text-center text-[0.75rem] text-ink-muted">
              New here?{" "}
              <Link href="/register" className="link-underline">
                Create an account
              </Link>
            </p>
          ) : null}
        </div>
      </div>

      <Dialog
        open={Boolean(paymentNotice)}
        onClose={() => setPaymentNotice(null)}
        title="Payment provider not configured"
        description={paymentNotice ?? ""}
        footer={
          <Button variant="secondary" onClick={() => setPaymentNotice(null)}>
            Close
          </Button>
        }
      />
    </div>
  );
}
