"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useDocuments } from "@/hooks/useDocuments";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DocumentRow } from "@/types";

type PageProps = {
  params: { documentId: string };
};

export default function DocumentChatPage({ params }: PageProps) {
  const { documentId } = params;
  const { documents, isLoading: listLoading, refetch } = useDocuments();
  const [doc, setDoc] = useState<DocumentRow | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchDoc = useCallback(async () => {
    const res = await fetch(`/api/documents/${documentId}`, {
      credentials: "include",
    });
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
      void refetch();
    }, 2000);
    return () => clearInterval(id);
  }, [doc, fetchDoc, refetch]);

  const shell = (main: React.ReactNode) => (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <ChatSidebar
        documents={documents}
        currentDocumentId={documentId}
        isLoading={listLoading}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      {main}
    </div>
  );

  if (loadError) {
    return shell(
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4 px-6 md:px-10">
        <Link
          href="/documents"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Back to documents
        </Link>
        <p className="text-destructive">{loadError}</p>
      </div>,
    );
  }

  if (!doc) {
    return shell(
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading document…
      </div>,
    );
  }

  if (doc.status === "processing") {
    return shell(
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 px-6">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-center text-sm text-muted-foreground">
          Processing &ldquo;{doc.name}&rdquo; — this may take a moment…
        </p>
        <Link href="/documents" className="text-sm text-primary hover:underline">
          Back to documents
        </Link>
      </div>,
    );
  }

  if (doc.status === "error") {
    return shell(
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4 px-6 md:px-10">
        <p className="text-destructive">
          This document failed to process. Try uploading again from your library.
        </p>
        <Link
          href="/documents"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Go to documents
        </Link>
      </div>,
    );
  }

  return shell(
    <ChatWindow
      documentId={documentId}
      document={doc}
      onOpenMenu={() => setMobileOpen(true)}
      onChatCleared={() => {
        void fetchDoc();
        void refetch();
      }}
    />,
  );
}
