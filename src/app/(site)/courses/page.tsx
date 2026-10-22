import type { Metadata } from "next";
import { CatalogClient } from "@/components/courses/CatalogClient";

export const metadata: Metadata = {
  title: "Explore Cybersecurity Courses",
  description:
    "Find structured video courses for the skills you want to develop, from foundational knowledge to specialized security topics.",
};

export default function CoursesPage() {
  return (
    <div className="border-b border-line">
      <div className="container-page py-14 lg:py-16">
        <header className="max-w-3xl">
          <p className="eyebrow">The Academy</p>
          <h1 className="heading-lg mt-4">Explore Cybersecurity Courses</h1>
          <p className="body-lg mt-5">
            Find structured video courses for the skills you want to develop,
            from foundational knowledge to specialized security topics.
          </p>
        </header>

        <div className="mt-10">
          <CatalogClient />
        </div>
      </div>
    </div>
  );
}
