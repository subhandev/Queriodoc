"use client";

import Link from "next/link";
import { FileText, Inbox, UploadCloud } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import type { DocumentRow } from "@/types";

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="h-5 w-12 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="h-5 w-5 animate-pulse rounded bg-white/[0.04]" />
      </div>
      <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/[0.04]" />
      <div className="mt-6 border-t border-[rgba(255,255,255,0.05)] pt-4">
        <div className="h-9 w-full animate-pulse rounded-lg bg-white/[0.04]" />
      </div>
    </div>
  );
}

type DocumentListProps = {
  documents: DocumentRow[];
  isLoading: boolean;
  query?: string;
  onDelete: (id: string) => Promise<void>;
};

export function DocumentList({
  documents,
  isLoading,
  query = "",
  onDelete,
}: DocumentListProps) {
  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        <h2 className="mt-5 text-[18px] font-medium text-foreground">No documents yet</h2>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Upload your first document to get started.
        </p>
        <Link
          href="/documents#upload"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[14px] font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
        >
          <UploadCloud className="h-4 w-4" />
          Upload a document
        </Link>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="mt-4 text-[14px] text-muted-foreground">
          No documents match &quot;{query}&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
      ))}
    </div>
  );
}
