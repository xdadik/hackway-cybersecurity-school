import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed border-line bg-surface/50 px-6 py-16 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mb-5 flex h-12 w-12 items-center justify-center border border-line bg-surface-sunken text-acid">
          {icon}
        </div>
      ) : null}
      <h3 className="heading-sm">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-secondary">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
