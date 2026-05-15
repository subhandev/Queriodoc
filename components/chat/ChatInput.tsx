"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading: boolean;
};

export function ChatInput({ value, onChange, onSubmit, onStop, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 5 * 24 + 20)}px`;
  }, [value]);

  return (
    <div className="shrink-0 w-full border-t border-[rgba(255,255,255,0.06)] bg-background">
      <div className="mx-auto w-full max-w-[720px] px-4 py-4 md:px-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="group relative flex items-end gap-2 rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[#111114] px-3 py-2 transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(124,109,250,0.15)]"
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            rows={1}
            disabled={isLoading}
            placeholder="Ask a question about this document..."
            className="block max-h-[140px] min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-[14px] leading-6 text-foreground placeholder:text-muted-foreground/70 outline-none disabled:opacity-60"
          />
          {isLoading && onStop ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-border bg-card px-3 text-[12px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              aria-label="Send message"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-[var(--primary-hover)] disabled:bg-white/10 disabled:text-muted-foreground"
            >
              <ArrowUp size={16} />
            </button>
          )}
        </form>
        <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
          Powered by GPT-4o · Answers grounded in your document
        </p>
      </div>
    </div>
  );
}
