"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BookOpen, ChevronDown, LayoutGrid, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useDismissOnOutside } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { initialsFromName } from "@/lib/format";
import type { SessionUser } from "@/lib/auth";

export function AccountMenu({
  user,
  showName = false,
  fullItems = true,
}: {
  user: SessionUser;
  showName?: boolean;
  fullItems?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useDismissOnOutside(menuRef, () => setOpen(false), open);

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      setOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-md border border-line bg-surface px-2 py-1.5 transition-colors hover:border-line-strong"
      >
        <Avatar initials={initialsFromName(user.name)} accent={user.accent} size="sm" />
        {showName ? (
          <span className="max-w-[9rem] truncate text-[0.875rem] text-ink-secondary">
            {user.name}
          </span>
        ) : null}
        <ChevronDown
          className={cn("h-4 w-4 text-ink-muted transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-56 overflow-hidden rounded-lg border border-line bg-surface-elevated shadow-pop animate-fade-in"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-[0.875rem] font-medium text-ink">{user.name}</p>
            <p className="mt-0.5 truncate text-[0.75rem] text-ink-muted">{user.email}</p>
          </div>
          <div className="p-1.5">
            {fullItems ? (
              <>
                <Link
                  href="/my-learning"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.875rem] text-ink-secondary transition-colors hover:bg-canvas-secondary hover:text-ink"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  My Learning
                </Link>
                <Link
                  href="/courses"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.875rem] text-ink-secondary transition-colors hover:bg-canvas-secondary hover:text-ink"
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  Browse courses
                </Link>
              </>
            ) : null}
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.875rem] text-ink-secondary transition-colors hover:bg-canvas-secondary hover:text-ink"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              Profile &amp; settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[0.875rem] text-ink-secondary transition-colors hover:bg-canvas-secondary hover:text-ink"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
