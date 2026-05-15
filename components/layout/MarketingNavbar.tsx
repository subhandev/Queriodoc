"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

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
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-2">
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
              className="inline-flex items-center rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
            >
              My documents
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
