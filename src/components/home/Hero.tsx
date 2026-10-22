import { ArrowRight, Lock, ShieldCheck, Terminal } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const TERMINAL_LINES = [
  { prompt: true, text: "hackway --status" },
  { prompt: false, text: "platform ......... online" },
  { prompt: false, text: "format ........... video lessons" },
  { prompt: false, text: "pace ............. self-directed" },
  { prompt: false, text: "progress ......... tracked per lesson" },
];

export function Hero() {
  return (
    <section className="home-hero relative overflow-hidden border-b border-line bg-canvas">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-noise opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-acid/10 blur-[120px]"
      />

      <div className="container-page relative grid gap-14 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:py-28">
        <div className="hero-copy">
          <p className="eyebrow">// Online cybersecurity education</p>

          <h1 className="heading-xl mt-5">
            Your next chapter in cybersecurity{" "}
            <span className="relative inline-block text-acid">
              starts here
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-[6px] w-full -rotate-1 bg-acid/30"
              />
            </span>
            .
          </h1>

          <p className="body-lg mt-6 max-w-xl">
            Structured video courses that take you from foundational concepts to
            specialised security skills — one focused lesson at a time.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/courses" size="lg">
              Explore courses
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              How it works
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t-2 border-line pt-7">
            {[
              { label: "Format", value: "Video lessons" },
              { label: "Pace", value: "Self-directed" },
              { label: "Tracking", value: "Per lesson" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 font-display text-[0.9375rem] font-extrabold uppercase tracking-wide text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-acid/30"
          />
          <div className="terminal-panel relative">
            <div className="flex items-center justify-between border-b border-line bg-surface-elevated px-4 py-2.5">
              <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-secondary">
                <Terminal className="h-3.5 w-3.5 text-acid" aria-hidden="true" />
                hackway@academy
              </span>
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-danger/80" />
                <span className="h-2 w-2 rounded-full bg-warning/80" />
                <span className="h-2 w-2 rounded-full bg-success/80" />
              </span>
            </div>

            <div className="space-y-2.5 px-5 py-6 text-[0.8125rem] leading-relaxed">
              {TERMINAL_LINES.map((line) => (
                <p
                  key={line.text}
                  className={line.prompt ? "text-white" : "text-ink-secondary"}
                >
                  {line.prompt ? (
                    <span className="mr-2 text-acid">$</span>
                  ) : (
                    <span className="mr-2 text-acid/50">&gt;</span>
                  )}
                  {line.text}
                </p>
              ))}
              <p className="text-white">
                <span className="mr-2 text-acid">$</span>
                <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-acid" />
              </p>
            </div>

            <div className="flex items-center gap-4 border-t border-line bg-surface px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-acid/40 bg-acid/10 text-acid">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-mono text-xs leading-relaxed text-ink-secondary">
                Learn the skills to understand threats and build a more secure digital world.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-line bg-surface px-5 py-3">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                No account required to browse
              </span>
              <Lock className="h-3.5 w-3.5 text-acid" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <a href="#academy" className="scroll-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-acid sm:flex">
        <span className="h-8 w-px bg-acid/60" aria-hidden="true" />
        Scroll to explore
        <span className="h-8 w-px bg-acid/60" aria-hidden="true" />
      </a>
    </section>
  );
}
