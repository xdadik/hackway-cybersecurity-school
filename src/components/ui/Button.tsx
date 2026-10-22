import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-sm border font-display font-extrabold uppercase tracking-[0.08em] transition-all duration-150 ease-smooth disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

const variants: Record<Variant, string> = {
  primary:
    "border-black bg-acid text-black shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-white hover:shadow-none",
  secondary:
    "border-line bg-surface-elevated text-white hover:border-acid hover:text-acid",
  ghost:
    "border-transparent text-ink-secondary hover:border-line hover:bg-surface-elevated hover:text-acid",
  subtle:
    "border-line bg-transparent text-ink-secondary hover:border-acid hover:text-acid",
  danger:
    "border-danger/50 bg-danger/10 text-danger hover:border-danger hover:bg-danger/20",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[0.6875rem]",
  md: "h-10 px-4 text-[0.75rem]",
  lg: "h-12 px-6 text-[0.875rem]",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
