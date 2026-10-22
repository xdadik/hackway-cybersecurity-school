"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Hackway Academy Global Error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080D16] text-[#F5F7FB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#101827] border border-[#202C3D] rounded-xl p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-white">Application Error</h1>
          <p className="text-sm text-[#A6B2C3]">
            A critical error occurred while rendering the page layout.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-[#38BDF8] text-[#080D16] font-semibold text-xs"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-[#141F30] text-white border border-[#202C3D] text-xs font-medium"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
