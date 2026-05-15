"use client";

import { useCallback, useState } from "react";
import type { DocumentRow } from "@/types";

type UploadPhase = "idle" | "uploading" | "processing" | "ready" | "error";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollDocumentReady(documentId: string): Promise<DocumentRow> {
  const maxAttempts = 120;
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`/api/documents/${documentId}`, {
      credentials: "include",
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? "Failed to check document status");
    }
    const doc = (await res.json()) as DocumentRow;
    if (doc.status === "ready") {
      return doc;
    }
    if (doc.status === "error") {
      throw new Error("Document processing failed. Try uploading again.");
    }
    await sleep(1500);
  }
  throw new Error("Processing timed out. Try again or use a smaller file.");
}

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
      setProgress(25);
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const text = await res.text();
      let parsed: unknown;
      try {
        parsed = text.trim() ? JSON.parse(text) : undefined;
      } catch {
        throw new Error(
          res.ok ? "Invalid response from server." : `Upload failed (${res.status}).`,
        );
      }

      if (!res.ok) {
        const errObj = parsed as { error?: string } | undefined;
        throw new Error(errObj?.error ?? "Upload failed");
      }

      const data = parsed as { documentId: string };
      if (!data?.documentId) {
        throw new Error("Invalid response from server.");
      }

      setPhase("processing");
      setProgress(45);

      const processRes = await fetch(`/api/documents/${data.documentId}/process`, {
        method: "POST",
        credentials: "include",
      });

      if (!processRes.ok) {
        const errBody = (await processRes.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errBody.error ?? "Processing failed");
      }

      setProgress(70);
      const doc = await pollDocumentReady(data.documentId);
      setProgress(100);
      setPhase("ready");
      return doc.id;
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
