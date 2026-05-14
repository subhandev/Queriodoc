"use client";

import { useCallback, useEffect, useState } from "react";
import type { DocumentRow } from "@/types";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? res.statusText);
      }
      const data = (await res.json()) as DocumentRow[];
      setDocuments(data);
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
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Delete failed");
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
