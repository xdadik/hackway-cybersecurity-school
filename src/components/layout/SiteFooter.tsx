import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const PLATFORM_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/my-learning", label: "My Learning" },
  { href: "/profile", label: "Profile" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function SiteFooter({ isAuthenticated }: { isAuthenticated: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-line bg-canvas-secondary/50">
      <div className="container-page py-14">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-secondary">
              Structured video courses that take you from foundational
              cybersecurity concepts to specialised security skills, one lesson
              at a time.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-acid">
                // Platform
              </h2>
              <ul className="mt-4 space-y-2.5">
                {PLATFORM_LINKS.map((link) => {
                  const target =
                    link.href === "/my-learning" && !isAuthenticated
                      ? "/signin"
                      : link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={target}
                        className="text-[0.9375rem] text-ink-secondary transition-colors hover:text-acid"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-acid">
                // Legal
              </h2>
              <ul className="mt-4 space-y-2.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-ink-secondary transition-colors hover:text-acid"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.75rem] text-ink-muted">
            © {year} Hackway Academy. All rights reserved.
          </p>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-muted">
            Learn // Practice // Repeat
          </p>
        </div>
      </div>
    </footer>
  );
}
