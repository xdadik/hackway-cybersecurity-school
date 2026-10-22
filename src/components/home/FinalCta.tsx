import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t-2 border-acid bg-acid">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-40"
      />
      <div className="container-page relative flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-black/60">
            // Ready when you are
          </p>
          <h2 className="mt-3 font-display text-[2.2rem] font-black uppercase leading-[0.95] tracking-[-0.02em] text-black sm:text-[3rem]">
            Start building your cybersecurity knowledge.
          </h2>
          <p className="mt-4 max-w-lg text-[1rem] leading-relaxed text-black/70">
            Find a course, follow the lessons, and keep moving forward.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
          <ButtonLink
            href="/courses"
            size="lg"
            className="border-black bg-black text-acid hover:bg-surface-elevated"
          >
            Explore courses
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink
            href="/my-learning"
            size="lg"
            variant="subtle"
            className="border-black/30 text-black hover:border-black hover:text-black"
          >
            My learning
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
