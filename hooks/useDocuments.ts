"use client";

import { useCallback, useEffect, useState } from "react";
import type { DocumentRow } from "@/types";

function parseJsonBody(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    return undefined;
  }
  return JSON.parse(trimmed) as unknown;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", { credentials: "include" });
      const text = await res.text();
      let parsed: unknown;
      try {
        parsed = parseJsonBody(text);
      } catch {
        throw new Error(
          res.ok
            ? "Invalid response from server."
            : `Request failed (${res.status}).`,
        );
      }

      if (!res.ok) {
        const errObj = parsed as { error?: string } | undefined;
        throw new Error(errObj?.error ?? res.statusText);
      }

      if (!Array.isArray(parsed)) {
        setDocuments([]);
        return;
      }

      setDocuments(parsed as DocumentRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load documents");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  const deleteDocument = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        let errMsg = "Delete failed";
        try {
          const body = text.trim() ? (JSON.parse(text) as { error?: string }) : undefined;
          errMsg = body?.error ?? errMsg;
        } catch {
          errMsg = res.statusText || errMsg;
        }
        throw new Error(errMsg);
      }
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    },
    [],
  );

  return {
    documents,
    isLoading,
    error,
    refetch: fetchDocuments,
    deleteDocument,
  };
}
