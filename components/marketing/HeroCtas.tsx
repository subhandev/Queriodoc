"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function HeroCtas() {
  return (
    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
      <SignedOut>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
        >
          Get started free <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="#how"
          className="inline-flex items-center rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-card"
        >
          See how it works
        </a>
      </SignedOut>
      <SignedIn>
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
        >
          Go to my documents <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="#how"
          className="inline-flex items-center rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-card"
        >
          See how it works
        </a>
      </SignedIn>
    </div>
  );
}
