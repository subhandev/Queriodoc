"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { cn } from "@/lib/utils";
import type { DocumentRow } from "@/types";

type PageProps = {
  params: { documentId: string };
};

export default function DocumentChatPage({ params }: PageProps) {
  const { documentId } = params;
  const [doc, setDoc] = useState<DocumentRow | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDoc = useCallback(async () => {
    const res = await fetch(`/api/documents/${documentId}`);
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setLoadError(body.error ?? "Failed to load document");
      setDoc(null);
      return;
    }
    const data = (await res.json()) as DocumentRow;
    setDoc(data);
    setLoadError(null);
  }, [documentId]);

  useEffect(() => {
    void fetchDoc();
  }, [fetchDoc]);

  useEffect(() => {
    if (!doc || doc.status !== "processing") {
      return;
    }
    const id = setInterval(() => {
      void fetchDoc();
    }, 2000);
    return () => clearInterval(id);
  }, [doc, fetchDoc]);

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <Link
          href="/documents"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
        >
          <ArrowLeft className="size-4" />
          Back to documents
        </Link>
        <p className="text-destructive">{loadError}</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex items-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading document…
      </div>
    );
  }

  if (doc.status === "processing") {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <Link
          href="/documents"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Processing &ldquo;{doc.name}&rdquo; — this may take a moment…
          </p>
        </div>
      </div>
    );
  }

  if (doc.status === "error") {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <Link
          href="/documents"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <p className="text-destructive">
          This document failed to process. Try uploading again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/documents"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <span className="text-sm text-muted-foreground truncate">{doc.name}</span>
      </div>
      <ChatWindow documentId={documentId} documentName={doc.name} />
    </div>
  );
}
