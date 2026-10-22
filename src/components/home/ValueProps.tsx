import { ListChecks, MonitorPlay, Timer } from "lucide-react";

const ITEMS = [
  {
    icon: MonitorPlay,
    title: "Structured video courses",
    description:
      "Every topic is broken into ordered, focused lessons so you always know what comes next.",
  },
  {
    icon: Timer,
    title: "Learn at your own pace",
    description:
      "Pause, rewind and pick a lesson back up whenever the time suits your schedule.",
  },
  {
    icon: ListChecks,
    title: "Track your progress",
    description:
      "Completed lessons and course progress are recorded so you can see exactly where you are.",
  },
];

export function ValueProps() {
  return (
    <section aria-label="Learning approach" className="border-b border-line bg-canvas">
      <div className="container-page grid gap-px bg-line py-px sm:grid-cols-3">
        {ITEMS.map((item, index) => (
          <div
            key={item.title}
            className="flex gap-4 bg-canvas px-1 py-10 sm:px-8"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-surface text-acid">
              <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="heading-sm mt-1.5">{item.title}</h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-secondary">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
