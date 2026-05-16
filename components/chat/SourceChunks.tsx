"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { sourceExcerpt, stripSourceBoilerplate } from "@/lib/rag/sourceExcerpt";
import type { SourceChunkPreview } from "@/types";

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
    <div className="mt-2 w-full min-w-0 max-w-[min(92%,36rem)] sm:max-w-[90%]">
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
            title={stripSourceBoilerplate(c.content)}
            className="max-w-[200px] truncate rounded-md border border-border bg-card px-2 py-1 text-[10.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {sourceExcerpt(c.content)}
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
              title={stripSourceBoilerplate(c.content)}
              className="rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/30"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {sourceExcerpt(c.content)}
              </div>
              <p className="mt-1 line-clamp-4 text-[12.5px] leading-snug text-muted-foreground">
                {stripSourceBoilerplate(c.content)}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
