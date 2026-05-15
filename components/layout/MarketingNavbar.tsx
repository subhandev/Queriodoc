"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-150 ${
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:h-16 sm:flex-nowrap sm:px-6 sm:py-0">
        <Logo className="min-w-0 shrink-0" />
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:flex-none">
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
            >
              Get started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/documents"
              className="inline-flex max-w-full items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)] sm:px-3.5"
            >
              <span className="truncate sm:hidden">Documents</span>
              <span className="hidden sm:inline">My documents</span>
            </Link>
            <UserButton afterSignOutUrl="/" appearance={clerkAppearance} />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
