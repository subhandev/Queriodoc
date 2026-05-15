"use client";

import Link from "next/link";
import { FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentRow } from "@/types";

type DocumentSidebarProps = {
  documents: DocumentRow[];
  currentDocumentId: string;
  isLoading?: boolean;
};

export function DocumentSidebar({
  documents,
  currentDocumentId,
  isLoading,
}: DocumentSidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="border-b border-border px-3 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Documents
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">Loading…</p>
        ) : documents.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">No documents yet.</p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {documents.map((doc) => {
              const isActive = doc.id === currentDocumentId;
              return (
                <li key={doc.id}>
                  <Link
                    href={`/documents/${doc.id}`}
                    className={cn(
                      "flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                    )}
                  >
                    <FileText className="mt-0.5 size-4 shrink-0" />
                    <span className="line-clamp-2 min-w-0 flex-1">{doc.name}</span>
                    {doc.status === "processing" && (
                      <Loader2 className="size-3.5 shrink-0 animate-spin" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
      <div className="border-t border-border p-2">
        <Link
          href="/documents"
          className="block rounded-md px-2 py-2 text-xs text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
        >
          Upload & manage →
        </Link>
      </div>
    </aside>
  );
}
