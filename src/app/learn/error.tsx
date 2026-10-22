"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Hackway Academy Classroom Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-canvas">
      <div className="max-w-md w-full bg-surface border border-line rounded-xl p-8 text-center space-y-5">
        <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-ink tracking-tight">
            Classroom Error
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            There was a problem loading this video lesson or playback state.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-acid text-canvas hover:bg-sky-400 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reload Lesson</span>
          </button>
          <Link
            href="/my-learning"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-elevated text-ink hover:text-white border border-line font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Learning</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
