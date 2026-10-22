import { cn } from "@/lib/utils";
import { CourseCard } from "@/components/courses/CourseCard";
import type { CourseSummary } from "@/lib/repo/courses";

export function CourseGrid({
  courses,
  className,
}: {
  courses: CourseSummary[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
