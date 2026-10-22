"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/Button";
import { CourseCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { formatRuntime } from "@/lib/format";

interface CatalogCourse {
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
  sectionCount: number;
  totalDurationSeconds: number;
  isDemo: boolean;
  priceCents: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_ALL = "all";
const LEVEL_ALL = "all";
const DURATION_ALL = "all";
const DURATION_SHORT = "short";
const DURATION_MEDIUM = "medium";
const DURATION_LONG = "long";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "shortest", label: "Shortest duration" },
  { value: "longest", label: "Longest duration" },
];

export function CatalogClient() {
  const [courses, setCourses] = useState<CatalogCourse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(CATEGORY_ALL);
  const [level, setLevel] = useState(LEVEL_ALL);
  const [duration, setDuration] = useState(DURATION_ALL);
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/courses")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      })
      .then((data: { courses: CatalogCourse[] }) => {
        if (cancelled) return;
        setCourses(data.courses);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCourses(null);
        setError(
          "The course catalogue could not be loaded. Check your connection and try again."
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const categories = useMemo(() => {
    const values = new Set((courses ?? []).map((course) => course.category));
    return Array.from(values).sort();
  }, [courses]);

  const filtered = useMemo(() => {
    if (!courses) return [];

    const needle = query.trim().toLowerCase();

    const result = courses.filter((course) => {
      if (category !== CATEGORY_ALL && course.category !== category) return false;
      if (level !== LEVEL_ALL && course.level !== level) return false;

      if (duration !== DURATION_ALL) {
        const seconds = course.totalDurationSeconds;
        if (duration === DURATION_SHORT && seconds >= 2 * 3600) return false;
        if (duration === DURATION_MEDIUM && (seconds < 2 * 3600 || seconds > 5 * 3600))
          return false;
        if (duration === DURATION_LONG && seconds <= 5 * 3600) return false;
      }

      if (needle) {
        const haystack = [
          course.title,
          course.category,
          course.level,
          course.tagline,
          course.description,
          course.instructorName ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "shortest":
        sorted.sort((a, b) => a.totalDurationSeconds - b.totalDurationSeconds);
        break;
      case "longest":
        sorted.sort((a, b) => b.totalDurationSeconds - a.totalDurationSeconds);
        break;
      default:
        sorted.sort((a, b) => {
          const rank = { Beginner: 1, Intermediate: 2, Advanced: 3 } as Record<string, number>;
          const diff = (rank[a.level] ?? 3) - (rank[b.level] ?? 3);
          if (diff !== 0) return diff;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
    }

    return sorted;
  }, [courses, query, category, level, duration, sort]);

  const hasActiveFilters =
    query.trim() !== "" ||
    category !== CATEGORY_ALL ||
    level !== LEVEL_ALL ||
    duration !== DURATION_ALL;

  const resetFilters = useCallback(() => {
    setQuery("");
    setCategory(CATEGORY_ALL);
    setLevel(LEVEL_ALL);
    setDuration(DURATION_ALL);
  }, []);

  const totalRuntime = useMemo(
    () =>
      (courses ?? []).reduce(
        (total, course) => total + course.totalDurationSeconds,
        0
      ),
    [courses]
  );

  return (
    <div>
      <div className="border-2 border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="course-search"
              className="mb-1.5 block font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-secondary"
            >
              Search courses
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
              />
              <input
                id="course-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses, topics, or skills…"
                className="h-11 w-full rounded-sm border border-line bg-surface-sunken pl-10 pr-3.5 text-[0.9375rem] text-ink placeholder:text-ink-muted/70 transition-colors focus:border-acid focus:outline-none focus:ring-1 focus:ring-acid/30"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:w-[46rem] lg:grid-cols-4">
            <Select
              label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              options={[
                { value: CATEGORY_ALL, label: "All Courses" },
                ...categories.map((item) => ({ value: item, label: item })),
              ]}
            />
            <Select
              label="Difficulty"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              options={[
                { value: LEVEL_ALL, label: "All Levels" },
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" },
              ]}
            />
            <Select
              label="Duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              options={[
                { value: DURATION_ALL, label: "Any Duration" },
                { value: DURATION_SHORT, label: "Under 2 Hours" },
                { value: DURATION_MEDIUM, label: "2–5 Hours" },
                { value: DURATION_LONG, label: "Over 5 Hours" },
              ]}
            />
            <Select
              label="Sort by"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              options={SORT_OPTIONS}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted" aria-live="polite">
            {loading
              ? "Loading courses…"
              : `${filtered.length} of ${courses?.length ?? 0} ${
                  (courses?.length ?? 0) === 1 ? "course" : "courses"
                }`}
            {!loading && courses && courses.length > 0 ? (
              <span className="ml-2 hidden sm:inline">
                · {formatRuntime(totalRuntime)} of curriculum available
              </span>
            ) : null}
          </p>

          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filters
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-4 border-2 border-danger/50 bg-danger/5 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <div>
                <h2 className="text-[0.9375rem] font-semibold text-ink">
                  Courses could not be loaded
                </h2>
                <p className="mt-1 text-[0.875rem] text-ink-secondary">{error}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRetryKey((key) => key + 1)}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<SlidersHorizontal className="h-5 w-5" aria-hidden="true" />}
            title="No courses match these filters"
            description="Try a different category, difficulty or duration — or clear the filters to see the full catalogue."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Clear all filters
              </Button>
            }
          />
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            )}
          >
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
