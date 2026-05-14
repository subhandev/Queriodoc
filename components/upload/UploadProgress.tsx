"use client";

type Phase = "idle" | "uploading" | "processing" | "ready" | "error";

type UploadProgressProps = {
  phase: Phase;
  progress: number;
};

const LABELS: Record<Phase, string> = {
  idle: "",
  uploading: "Uploading file…",
  processing: "Parsing and embedding your document…",
  ready: "Document ready.",
  error: "Something went wrong.",
};

export function UploadProgress({ phase, progress }: UploadProgressProps) {
  if (phase === "idle") {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        {phase !== "error" && phase !== "ready" && (
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        )}
        <span>{LABELS[phase]}</span>
      </div>
      {phase !== "error" && phase !== "ready" && (
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
