"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import type { SourceChunkPreview } from "@/types";

type SourceChunksProps = {
  chunks: SourceChunkPreview[];
};

export function SourceChunks({ chunks }: SourceChunksProps) {
  const [open, setOpen] = useState(false);

  if (chunks.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 max-w-[75%]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.1)] bg-transparent px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <BookOpen size={11} />
        Sources ({chunks.length})
      </button>
      {open ? (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {chunks.map((c) => (
            <div
              key={c.chunk_index}
              title={c.content}
              className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-card px-3 py-2.5 transition-colors hover:border-[rgba(255,255,255,0.18)]"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Chunk {c.chunk_index}
              </div>
              <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted-foreground">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
