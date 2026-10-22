import { cn } from "@/lib/utils";

const accentStyles: Record<string, string> = {
  cyan: "border-acid bg-acid text-black",
  blue: "border-line-strong bg-surface-elevated text-white",
  lavender: "border-line bg-surface text-ink-secondary",
  neutral: "border-line-strong bg-surface-elevated text-white",
};

export function Avatar({
  initials,
  accent = "neutral",
  size = "md",
  className,
}: {
  initials: string;
  accent?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm border font-mono font-bold uppercase",
        accentStyles[accent] ?? accentStyles.neutral,
        size === "sm" && "h-7 w-7 text-[0.6875rem]",
        size === "md" && "h-8 w-8 text-xs",
        size === "lg" && "h-14 w-14 text-base",
        className
      )}
    >
      {initials}
    </span>
  );
}
