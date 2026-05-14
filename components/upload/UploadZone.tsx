"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/useUpload";
import { UploadProgress } from "./UploadProgress";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ".pdf,.docx,.txt";

type UploadZoneProps = {
  onSuccess: (documentId: string) => void;
  className?: string;
};

function validateFile(file: File): string | null {
  const lower = file.name.toLowerCase();
  const ok =
    lower.endsWith(".pdf") || lower.endsWith(".docx") || lower.endsWith(".txt");
  if (!ok) {
    return "Please choose a PDF, DOCX, or TXT file.";
  }
  if (file.size > MAX_BYTES) {
    return "File too large. Maximum size is 10MB.";
  }
  return null;
}

export function UploadZone({ onSuccess, className }: UploadZoneProps) {
  const { upload, isUploading, progress, error, phase } = useUpload();
  const [selected, setSelected] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((file: File | undefined) => {
    setLocalError(null);
    if (!file) {
      setSelected(null);
      return;
    }
    const err = validateFile(file);
    if (err) {
      setSelected(null);
      setLocalError(err);
      return;
    }
    setSelected(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      onFile(file);
    },
    [onFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onFile(file);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!selected) {
      return;
    }
    try {
      const id = await upload(selected);
      onSuccess(id);
      setSelected(null);
    } catch {
      /* error surfaced via hook */
    }
  };

  const displayError = localError ?? error;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition hover:bg-muted/50",
          isUploading && "pointer-events-none opacity-70",
        )}
      >
        <p className="text-sm font-medium text-foreground">
          Drag and drop a document here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, DOCX, or TXT — up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {selected && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <div>
            <p className="font-medium">{selected.name}</p>
            <p className="text-muted-foreground">
              {(selected.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            disabled={isUploading}
            onClick={handleSubmit}
          >
            Upload and process
          </Button>
        </div>
      )}

      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}

      <UploadProgress phase={phase} progress={progress} />
    </div>
  );
}
