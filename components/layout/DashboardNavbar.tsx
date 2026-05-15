"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

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
      <nav className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-8">
        <Logo href="/documents" />
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  );
}
