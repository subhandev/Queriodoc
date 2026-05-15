"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import type { SourceChunkPreview } from "@/types";

function excerpt(content: string, max = 42): string {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
}

type SourceChunksProps = {
  chunks: SourceChunkPreview[];
};

export function SourceChunks({ chunks }: SourceChunksProps) {
  const [expanded, setExpanded] = useState(false);

  if (chunks.length === 0) {
    return null;
  }

  const visibleCount = 3;
  const visible = chunks.slice(0, visibleCount);
  const remaining = chunks.length - visibleCount;

  return (
    <div className="mt-2 max-w-[90%]">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10.5px] text-muted-foreground">
          <FileText className="h-3 w-3" />
          Sources
        </span>
        {visible.map((c) => (
          <button
            key={c.chunk_index}
            type="button"
            onClick={() => setExpanded((v) => !v)}
            title={c.content}
            className="max-w-[200px] truncate rounded-md border border-border bg-card px-2 py-1 text-[10.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {excerpt(c.content)}
          </button>
        ))}
        {remaining > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md border border-border bg-card px-2 py-1 text-[10.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            +{remaining} more
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md border border-border bg-transparent px-2 py-1 text-[10.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {expanded ? "Hide" : "Expand"}
          </button>
        )}
      </div>
      {expanded ? (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {chunks.map((c) => (
            <div
              key={c.chunk_index}
              title={c.content}
              className="rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/30"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Excerpt {c.chunk_index + 1}
              </div>
              <p className="mt-1 line-clamp-4 text-[12.5px] leading-snug text-muted-foreground">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
