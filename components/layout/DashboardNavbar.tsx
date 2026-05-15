"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

type DashboardNavbarProps = {
  uploadHref?: string;
};

export function DashboardNavbar({ uploadHref = "/documents#upload" }: DashboardNavbarProps) {
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
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href={uploadHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
          >
            <UploadCloud className="h-4 w-4" />
            Upload document
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
    </header>
  );
}
