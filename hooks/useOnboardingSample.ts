"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SeedResponse = {
  documentId: string;
  created: boolean;
  shouldOpenSampleChat: boolean;
};

export function useOnboardingSample(options: {
  documentsCount: number;
  isLoading: boolean;
  onSeeded: () => Promise<void>;
}) {
  const { documentsCount, isLoading, onSeeded } = options;
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const attemptedRef = useRef(false);

  const runSeed = useCallback(async () => {
    setSeeding(true);
    setSeedError(null);
    try {
      const res = await fetch("/api/onboarding/sample", {
        method: "POST",
        credentials: "include",
      });
      const body = (await res.json().catch(() => ({}))) as SeedResponse & {
        error?: string;
      };
      if (!res.ok) {
        throw new Error(body.error ?? "Failed to set up sample document");
      }
      await onSeeded();
      if (body.shouldOpenSampleChat && body.documentId) {
        router.replace(`/documents/${body.documentId}`);
      }
    } catch (e) {
      setSeedError(e instanceof Error ? e.message : "Setup failed");
    } finally {
      setSeeding(false);
    }
  }, [onSeeded, router]);

  useEffect(() => {
    if (isLoading || attemptedRef.current) return;
    if (documentsCount > 0) return;

    attemptedRef.current = true;
    void runSeed();
  }, [isLoading, documentsCount, runSeed]);

  return { seeding, seedError };
}
