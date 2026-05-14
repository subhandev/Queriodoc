"use client";

import { useCallback, useState } from "react";

type UploadPhase = "idle" | "uploading" | "processing" | "ready" | "error";

export function useUpload() {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File) => {
    setError(null);
    setProgress(0);
    setPhase("uploading");

    const form = new FormData();
    form.append("file", file);

    try {
      setProgress(35);
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: form,
      });

      setPhase("processing");
      setProgress(70);

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Upload failed");
      }

      const data = (await res.json()) as { documentId: string; chunkCount: number };
      setProgress(100);
      setPhase("ready");
      return data.documentId;
    } catch (e) {
      setPhase("error");
      const message = e instanceof Error ? e.message : "Upload failed";
      setError(message);
      throw e;
    } finally {
      setTimeout(() => {
        setPhase("idle");
        setProgress(0);
      }, 800);
    }
  }, []);

  const isUploading = phase === "uploading" || phase === "processing";

  return {
    upload,
    isUploading,
    progress,
    error,
    phase,
  };
}
