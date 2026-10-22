"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { requestSignOut } from "@/lib/client";

export function ProfileForm({ name }: { name: string }) {
  const router = useRouter();
  const { notify } = useToast();
  const [value, setValue] = useState(name);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Your profile could not be saved.");
        return;
      }

      notify("Your display name has been updated.", "success");
      router.refresh();
    } catch {
      setError("Your profile could not be saved. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4" noValidate>
      <Input
        label="Display name"
        name="name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        error={error}
        autoComplete="name"
        maxLength={80}
        hint="Shown on your learning pages. Your email address cannot be changed here."
      />
      <Button type="submit" disabled={pending || value.trim().length < 2}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();

  const signOut = async () => {
    await requestSignOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="danger" onClick={signOut}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </Button>
  );
}
