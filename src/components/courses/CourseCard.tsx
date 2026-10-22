import Link from "next/link";
import { ArrowRight, Clock, Layers, PlayCircle } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatRuntime } from "@/lib/format";

export interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: string;
  thumbnail: string;
  instructorName: string | null;
  lessonCount: number;
  totalDurationSeconds: number;
  isDemo: boolean;
  priceCents: number | null;
}

export function CourseCard({
  course,
  href,
  className,
}: {
  course: CourseCardData;
  href?: string;
  className?: string;
}) {
  const target = href ?? `/courses/${course.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col border-2 border-line bg-surface transition-all duration-200 ease-smooth hover:-translate-y-1 hover:border-acid hover:shadow-hard-acid-sm",
        className
      )}
    >
      <Link
        href={target}
        className="relative block aspect-video overflow-hidden border-b-2 border-line bg-surface-sunken"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={course.thumbnail}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center border border-white/25 bg-black/80 text-white transition-colors group-hover:border-acid group-hover:text-acid">
          <PlayCircle className="h-4 w-4" />
        </span>
        {course.isDemo ? (
          <span className="absolute right-3 top-3 border border-white/20 bg-black/85 px-2 py-0.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-ink-secondary">
            Demo content
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-acid">
            // {course.category}
          </span>
          <DifficultyBadge level={course.level} className="ml-auto" />
        </div>

        <h3 className="mt-3 font-display text-[1.0625rem] font-extrabold uppercase leading-tight tracking-[-0.01em] text-white">
          <Link
            href={target}
            className="transition-colors hover:text-acid focus-visible:outline-none"
          >
            {course.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[0.875rem] leading-relaxed text-ink-secondary">
          {course.tagline || course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.75rem] text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            {course.lessonCount} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatRuntime(course.totalDurationSeconds)}
          </span>
          {course.instructorName ? (
            <span className="truncate">{course.instructorName}</span>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-muted">
            {course.priceCents === null ? (
              <span className="text-acid">Free</span>
            ) : (
              "Paid course"
            )}
          </span>
          <Link
            href={target}
            className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:text-acid"
          >
            <span>View course</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
