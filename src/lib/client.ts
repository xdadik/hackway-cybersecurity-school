/** Client-side helpers shared by interactive components. */

export async function requestSignOut(): Promise<void> {
  try {
    await fetch("/api/auth/signout", { method: "POST" });
  } catch {
    // Signing out is best-effort: the redirect still happens below.
  }
}
