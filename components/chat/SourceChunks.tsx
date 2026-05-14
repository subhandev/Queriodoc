"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SourceChunkPreview } from "@/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type SourceChunksProps = {
  chunks: SourceChunkPreview[];
};

const PREVIEW_LEN = 180;

export function SourceChunks({ chunks }: SourceChunksProps) {
  const [open, setOpen] = useState(false);

  if (chunks.length === 0) {
    return null;
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-2">
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-8 gap-1 px-2 text-xs",
        )}
      >
          <ChevronDown
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
          Sources ({chunks.length} chunks)
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
        {chunks.map((c) => (
          <div key={c.chunk_index}>
            <p className="font-medium text-muted-foreground">Chunk #{c.chunk_index}</p>
            <p className="mt-0.5 text-foreground/90">
              {c.content.length > PREVIEW_LEN
                ? `${c.content.slice(0, PREVIEW_LEN)}…`
                : c.content}
            </p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
