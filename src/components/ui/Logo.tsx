import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HEIGHTS = {
  sm: "h-7",
  md: "h-8",
  lg: "h-10",
} as const;

export function Logo({
  className,
  href = "/",
  size = "md",
  priority = false,
}: {
  className?: string;
  href?: string;
  size?: keyof typeof HEIGHTS;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
        className
      )}
      aria-label="Hackway Academy, home"
    >
      <Image
        src="/logo/hackway-logo.png"
        alt="Hackway Academy"
        width={1325}
        height={628}
        priority={priority}
        className={cn("w-auto", HEIGHTS[size])}
      />
    </Link>
  );
}
