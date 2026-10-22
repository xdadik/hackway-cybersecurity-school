import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/ui/Logo";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create your Hackway Academy account to enrol in courses.",
};

export default function RegisterPage() {
  const user = getCurrentUser();
  if (user) {
    redirect("/my-learning");
  }

  return (
    <div className="border-b border-line">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-md">
          <Logo />
          <h1 className="heading-md mt-10">Create your account</h1>
          <p className="body-base mt-3">
            Register to enrol in courses, watch lessons and keep your progress
            saved between sessions.
          </p>

          <ul className="mt-8 space-y-3 text-[0.9375rem] text-ink-secondary">
            {[
              "Enrol in free courses and start learning immediately.",
              "Resume the exact lesson you stopped watching.",
              "Track completed lessons and course progress.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acid"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-md lg:justify-self-end">
          <div className="surface-card p-6 sm:p-8">
            <h2 className="text-[1.25rem] font-semibold text-ink">Register</h2>
            <p className="mt-1.5 text-[0.875rem] text-ink-secondary">
              It takes less than a minute to set up your account.
            </p>
            <div className="mt-6">
              <AuthForm mode="register" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
