"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { libraryBanner } from "@/lib/onboarding/copy";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OnboardingBannerProps = {
  sampleDocumentId: string;
};

export function OnboardingBanner({ sampleDocumentId }: OnboardingBannerProps) {
  return (
    <div
      className="rounded-xl border border-primary/25 bg-[rgba(124,109,250,0.08)] p-5 sm:p-6"
      role="status"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-foreground">{libraryBanner.title}</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{libraryBanner.body}</p>
          </div>
        </div>
        <Link
          href={`/documents/${sampleDocumentId}`}
          className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
        >
          {libraryBanner.cta}
        </Link>
      </div>
    </div>
  );
}
