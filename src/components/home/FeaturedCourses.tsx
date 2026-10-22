import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { listFeaturedCourses } from "@/lib/repo/courses";

export function FeaturedCourses() {
  const courses = listFeaturedCourses(6);

  return (
    <section id="academy" className="border-b border-line bg-canvas-secondary/40">
      <div className="container-page py-20 lg:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">// Explore the academy</p>
            <h2 className="heading-lg mt-4">Courses built for your growth</h2>
            <p className="body-base mt-4 max-w-xl">
              Explore focused learning paths designed to help you understand
              cybersecurity step by step.
            </p>
          </div>

          <Link
            href="/courses"
            className="group inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent pb-1 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-white transition-colors hover:border-acid hover:text-acid"
          >
            <span>View all courses</span>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-12">
          <CourseGrid courses={courses} />
        </div>
      </div>
    </section>
  );
}
