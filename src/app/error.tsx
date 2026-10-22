"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Hackway Academy App Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-surface border border-line rounded-xl p-8 text-center space-y-5">
        <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-ink tracking-tight">
            Something unexpected occurred
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            An error occurred while loading this page. You can try refreshing the component or return to the courses catalog.
          </p>
        </div>

        {error.digest && (
          <div className="text-[11px] font-mono text-ink-muted bg-canvas p-2 rounded border border-line">
            Error digest: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-acid text-canvas hover:bg-sky-400 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/courses"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-elevated text-ink hover:text-white border border-line hover:border-acid/40 font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Courses Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
