"use client";

import { useCallback, useRef, useState } from "react";
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
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startUpload = useCallback(
    async (file: File) => {
      if (isUploading) {
        return;
      }
      setLocalError(null);
      const err = validateFile(file);
      if (err) {
        setLocalError(err);
        return;
      }
      setActiveFile(file);
      try {
        const id = await upload(file);
        onSuccess(id);
      } catch {
        /* error surfaced via hook */
      } finally {
        setActiveFile(null);
      }
    },
    [isUploading, upload, onSuccess],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        void startUpload(file);
      }
    },
    [startUpload],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) {
      void startUpload(file);
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
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-8 text-center transition hover:border-primary/40 hover:bg-card/60 sm:px-6 sm:py-10",
          isUploading && "pointer-events-none opacity-70",
        )}
      >
        <p className="text-sm font-medium text-foreground">
          {isUploading
            ? "Uploading your document…"
            : "Drag and drop a document here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, DOCX, or TXT — up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={isUploading}
          onChange={handleChange}
        />
      </div>

      {activeFile && isUploading && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{activeFile.name}</span>
          {" · "}
          {(activeFile.size / 1024).toFixed(1)} KB
        </p>
      )}

      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}

      <UploadProgress phase={phase} progress={progress} />
    </div>
  );
}
