"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

type Mode = "signin" | "register";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_DESTINATION = "/my-learning";

function safeDestination(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_DESTINATION;
  }
  return value;
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notify } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const nextPath = safeDestination(searchParams.get("next"));

  const validate = () => {
    const errors: Record<string, string> = {};

    if (mode === "register" && name.trim().length < 2) {
      errors.name = "Enter your full name.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Enter your password.";
    } else if (
      mode === "register" &&
      (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    ) {
      errors.password = "Use at least 8 characters with a letter and a number.";
    }
    if (mode === "register" && password !== confirmPassword) {
      errors.confirmPassword = "The passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setError(null);

    if (!validate()) return;

    setPending(true);
    try {
      const response = await fetch(
        mode === "signin" ? "/api/auth/signin" : "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "signin" ? { email, password } : { name, email, password }
          ),
        }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      notify(
        mode === "signin"
          ? "Welcome back to Hackway Academy."
          : "Your account has been created.",
        "success"
      );
      router.push(nextPath);
      router.refresh();
    } catch {
      setError("The server could not be reached. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((visible) => !visible)}
      className="rounded-md p-2 text-ink-muted transition-colors hover:text-ink"
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Eye className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error ? (
        <p
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-[0.875rem] text-danger"
        >
          {error}
        </p>
      ) : null}

      {mode === "register" ? (
        <Input
          label="Full name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          autoComplete="name"
          placeholder="Alex Rivera"
        />
      ) : null}

      <Input
        label="Email address"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />

      <Input
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        autoComplete={mode === "signin" ? "current-password" : "new-password"}
        placeholder={mode === "signin" ? "Your password" : "At least 8 characters"}
        trailing={passwordToggle}
      />

      {mode === "register" ? (
        <Input
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          placeholder="Repeat your password"
        />
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {mode === "signin" ? "Signing in…" : "Creating account…"}
          </>
        ) : mode === "signin" ? (
          "Sign in"
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-[0.875rem] text-ink-secondary">
        {mode === "signin" ? (
          <>
            New to Hackway Academy?{" "}
            <Link href="/register" className="link-underline text-ink">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/signin" className="link-underline text-ink">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
