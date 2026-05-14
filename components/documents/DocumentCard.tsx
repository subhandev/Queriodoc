"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DocumentRow, DocumentStatus } from "@/types";

function statusVariant(
  status: DocumentStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ready":
      return "default";
    case "processing":
      return "secondary";
    case "error":
      return "destructive";
    default:
      return "outline";
  }
}

type DocumentCardProps = {
  document: DocumentRow;
  onDelete: (id: string) => Promise<void>;
};

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const created = new Date(document.created_at).toLocaleString();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(document.id);
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Link href={`/documents/${document.id}`} className="block h-full">
        <Card className="h-full transition hover:ring-2 hover:ring-ring/40">
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
            <CardTitle className="line-clamp-2 text-base leading-snug">
              {document.name}
            </CardTitle>
            <Badge variant="outline" className="shrink-0 uppercase">
              {document.file_type}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(document.status)}>
                {document.status}
              </Badge>
              <span>{document.chunk_count ?? 0} chunks</span>
            </div>
            <p>{created}</p>
          </CardContent>
          <CardFooter
            className="justify-end border-t border-border pt-3"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      </Link>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete document?</DialogTitle>
            <DialogDescription>
              This removes the file, embeddings, and chat history for{" "}
              <span className="font-medium text-foreground">{document.name}</span>
              . This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
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
