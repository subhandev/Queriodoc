"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { sampleCard } from "@/lib/onboarding/copy";
import type { DocumentRow, FileType } from "@/types";
import { cn } from "@/lib/utils";

function typeBadgeClass(type: FileType): string {
  const upper = type.toUpperCase();
  const styles: Record<string, string> = {
    PDF: "bg-[rgba(239,68,68,0.15)] text-[#F87171]",
    DOCX: "bg-[rgba(59,130,246,0.15)] text-[#60A5FA]",
    TXT: "bg-[rgba(124,109,250,0.15)] text-[#A78BFA]",
  };
  return styles[upper] ?? styles.TXT;
}

function TypeBadge({ type }: { type: FileType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-[10px] py-[4px] text-[11px] font-medium uppercase",
        typeBadgeClass(type),
      )}
    >
      {type}
    </span>
  );
}

type DocumentCardProps = {
  document: DocumentRow;
  onDelete: (id: string) => Promise<void>;
};

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    globalThis.document.addEventListener("mousedown", onClick);
    return () => globalThis.document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const isSample = document.is_sample === true;
  const uploadedAt = new Date(document.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const messageCount = document.message_count ?? 0;
  const messageLabel = messageCount === 1 ? "message" : "messages";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(document.id);
      setConfirmOpen(false);
      setMenuOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-150 hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1C1C22]">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={document.file_type} />
          {isSample ? (
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {sampleCard.badge}
            </span>
          ) : null}
        </div>
          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Document options"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all duration-150 hover:bg-white/[0.05] hover:text-foreground group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-9 z-10 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-white/[0.04]"
                  onClick={() => setMenuOpen(false)}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-[13px] text-[#F87171] transition-colors hover:bg-white/[0.04]"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <h3
          className="mt-3 truncate text-[15px] font-medium text-foreground"
          title={document.name}
        >
          {document.name}
        </h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {isSample ? sampleCard.subtitle : `Uploaded ${uploadedAt}`}
        </p>
        {isSample ? (
          <p className="mt-1 text-[12px] text-muted-foreground/80">{sampleCard.helper}</p>
        ) : null}
        <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          {messageCount} {messageLabel}
        </p>

        <div className="mt-auto w-full">
          <div className="mt-4 border-t border-[rgba(255,255,255,0.05)] pt-4">
            <Link
              href={`/documents/${document.id}`}
              className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-transparent text-[13px] font-medium text-primary transition-colors duration-150 hover:bg-primary hover:text-primary-foreground"
            >
              Open chat
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete document?</DialogTitle>
            <DialogDescription>
              This removes the file, embeddings, and chat history for{" "}
              <span className="font-medium text-foreground">{document.name}</span>. This cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void handleDelete()}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
