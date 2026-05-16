"use client";

import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-foreground">
      <h1 className="text-lg font-medium">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        An unexpected error occurred. You can try again or return to your documents.
      </p>
      <div className="flex gap-2">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <a href="/documents" className={cn(buttonVariants({ variant: "outline" }))}>
          Go to documents
        </a>
      </div>
    </div>
  );
}
