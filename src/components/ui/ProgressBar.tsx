import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  label,
  className,
  size = "md",
  showValue = false,
}: {
  value: number;
  label: string;
  className?: string;
  size?: "sm" | "md";
  showValue?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("w-full", className)}>
      {showValue ? (
        <div className="mb-1.5 flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
          <span className="text-ink-muted">{label}</span>
          <span className="font-semibold text-acid">{clamped}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn(
          "w-full overflow-hidden rounded-sm border border-line bg-surface-sunken",
          size === "sm" ? "h-1.5" : "h-2"
        )}
      >
        <div
          className="h-full bg-acid transition-[width] duration-300 ease-smooth"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
