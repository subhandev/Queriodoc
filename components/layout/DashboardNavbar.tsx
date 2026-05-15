"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { NavAccountMenu } from "@/components/layout/NavAccountMenu";

export function DashboardNavbar() {
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
      <nav className="mx-auto flex min-h-14 max-w-[1100px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Logo href="/documents" />
        <NavAccountMenu />
      </nav>
    </header>
  );
}
