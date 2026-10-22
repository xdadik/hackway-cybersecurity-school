"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { requestSignOut } from "@/lib/client";
import { cn } from "@/lib/utils";
import { initialsFromName } from "@/lib/format";
import type { SessionUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/my-learning", label: "My Learning" },
];

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const signOut = async () => {
    await requestSignOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-black/20 bg-acid text-black">
        <div className="container-page flex h-8 items-center justify-between gap-4 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.18em]">
          <p>Structured cybersecurity education</p>
          <p className="hidden sm:block">Self-paced // Progress tracked</p>
        </div>
      </div>

      <div className="border-b border-line bg-canvas/90 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Logo priority />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 border-b-2 pb-1 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                      isActive(link.href)
                        ? "border-acid text-white"
                        : "border-transparent text-ink-secondary hover:border-line-strong hover:text-white"
                    )}
                  >
                    <span
                      className={cn(
                        "text-acid",
                        isActive(link.href) ? "opacity-100" : "opacity-0"
                      )}
                      aria-hidden="true"
                    >
                      //
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <AccountMenu user={user} showName />
            ) : (
              <>
                <ButtonLink href="/signin" variant="ghost" size="sm">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/register" size="sm">
                  Get started
                </ButtonLink>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink-secondary transition-colors hover:border-acid hover:text-acid md:hidden"
          >
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          className="animate-fade-in border-b-2 border-acid bg-canvas md:hidden"
        >
          <nav aria-label="Mobile" className="container-page py-4">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 border-b border-line py-3 font-mono text-[0.8125rem] uppercase tracking-[0.14em] transition-colors",
                      isActive(link.href)
                        ? "text-acid"
                        : "text-ink-secondary hover:text-white"
                    )}
                  >
                    <span className="text-[0.6875rem] text-ink-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={initialsFromName(user.name)}
                      accent={user.accent}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[0.9375rem] text-white">
                        {user.name}
                      </p>
                      <p className="truncate font-mono text-[0.75rem] text-ink-muted">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="block border border-line px-3 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-secondary transition-colors hover:border-acid hover:text-acid"
                  >
                    Profile &amp; settings
                  </Link>
                  <Button
                    variant="subtle"
                    className="w-full"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <ButtonLink href="/register" className="w-full">
                    Get started
                  </ButtonLink>
                  <ButtonLink
                    href="/signin"
                    variant="secondary"
                    className="w-full"
                  >
                    Sign in
                  </ButtonLink>
                </div>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
