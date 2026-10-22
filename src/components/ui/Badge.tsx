import { cn } from "@/lib/utils";

type Tone = "acid" | "neutral" | "blue" | "success" | "warning" | "muted";

const tones: Record<Tone, string> = {
  acid: "border-acid bg-acid text-black",
  neutral: "border-line bg-surface-elevated text-white",
  blue: "border-line bg-surface-elevated text-ink-secondary",
  success: "border-success/50 bg-success/10 text-success",
  warning: "border-warning/50 bg-warning/10 text-warning",
  muted: "border-line bg-surface text-ink-muted",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const difficultyTone: Record<string, Tone> = {
  Beginner: "acid",
  Intermediate: "neutral",
  Advanced: "warning",
};

export function DifficultyBadge({
  level,
  className,
}: {
  level: string;
  className?: string;
}) {
  return (
    <Badge tone={difficultyTone[level] ?? "neutral"} className={className}>
      {level}
    </Badge>
  );
}
