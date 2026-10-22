const STEPS = [
  {
    number: "01",
    title: "Choose your course",
    description:
      "Find a subject that matches your experience and goals, from foundations to specialist topics.",
  },
  {
    number: "02",
    title: "Learn through video",
    description:
      "Watch organized lessons whenever it suits your schedule, and rewind the parts you want to see again.",
  },
  {
    number: "03",
    title: "Continue where you left off",
    description:
      "Track completed lessons and return to your current position in a course at any time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-b border-line bg-canvas">
      <div className="container-page py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">// How it works</p>
          <h2 className="heading-lg mt-4">A simpler way to learn cybersecurity</h2>
          <p className="body-base mt-4 max-w-xl">
            Three steps, no clutter. The academy keeps the focus on the lesson
            itself.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="group relative border-2 border-line bg-surface p-6 transition-colors hover:border-acid/60"
            >
              <span className="font-display text-5xl font-black leading-none tracking-tight text-acid/25 transition-colors group-hover:text-acid/50">
                {step.number}
              </span>
              <h3 className="heading-sm mt-5">{step.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
