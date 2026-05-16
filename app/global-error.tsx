"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#131316] font-sans text-[#f4f4f5] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-lg font-medium">Something went wrong</h1>
          <p className="max-w-md text-center text-sm text-[#a1a1aa]">
            A critical error occurred. Please refresh the page or try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-[#7c60ff] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
