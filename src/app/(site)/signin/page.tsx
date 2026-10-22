import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/ui/Logo";
import { getCurrentUser } from "@/lib/auth";
import { DEMO_ACCOUNT } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to continue your Hackway Academy courses.",
};

export default function SignInPage() {
  const user = getCurrentUser();
  if (user) {
    redirect("/my-learning");
  }

  return (
    <div className="border-b border-line">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-md">
          <Logo />
          <h1 className="heading-md mt-10">Welcome back</h1>
          <p className="body-base mt-3">
            Sign in to continue your courses, resume your last lesson and track
            your progress.
          </p>

          <div className="mt-10 rounded-lg border border-line bg-surface p-4">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Demo account
            </p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-secondary">
              Email:{" "}
              <span className="font-mono text-ink">{DEMO_ACCOUNT.email}</span>
              <br />
              Password:{" "}
              <span className="font-mono text-ink">{DEMO_ACCOUNT.password}</span>
            </p>
          </div>
        </div>

        <div className="max-w-md lg:justify-self-end">
          <div className="surface-card p-6 sm:p-8">
            <h2 className="text-[1.25rem] font-semibold text-ink">Sign in</h2>
            <p className="mt-1.5 text-[0.875rem] text-ink-secondary">
              Enter the email address and password for your account.
            </p>
            <div className="mt-6">
              <AuthForm mode="signin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
