import Link from "next/link";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-surface border border-line rounded-xl p-8 text-center space-y-5">
        <div className="h-12 w-12 rounded-full bg-acid/10 text-acid border border-acid/20 flex items-center justify-center mx-auto">
          <Compass className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-acid font-semibold">
            404 — Page Not Found
          </span>
          <h1 className="text-xl font-bold text-ink tracking-tight">
            The requested course or page does not exist
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            The page you are trying to access might have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/courses"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-acid text-canvas hover:bg-sky-400 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Browse Courses</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-elevated text-ink hover:text-white border border-line font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
