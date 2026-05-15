"use client";

import type { QueriodocUIMessage } from "@/types";
import { MarkdownMessage } from "./MarkdownMessage";
import { SourceChunks } from "./SourceChunks";

function textFromParts(message: QueriodocUIMessage): string {
  return message.parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && "text" in p,
    )
    .map((p) => p.text)
    .join("");
}

function sourcesFromParts(message: QueriodocUIMessage) {
  for (const part of message.parts) {
    if (part.type === "data-sources" && "data" in part) {
      const data = part.data as { chunks?: { content: string; chunk_index: number }[] };
      if (data.chunks) {
        return data.chunks;
      }
    }
  }
  return [];
}

function formatTime(createdAt?: string) {
  if (!createdAt) return "";
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

type ChatMessageProps = {
  message: QueriodocUIMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const text = textFromParts(message);
  const sources = message.role === "assistant" ? sourcesFromParts(message) : [];
  const timeLabel = formatTime(message.metadata?.createdAt);
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="group flex flex-col items-end">
        <div className="max-w-[min(85%,28rem)] min-w-0 rounded-[12px_12px_2px_12px] bg-primary px-3.5 py-2.5 text-[14px] leading-snug text-white">
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
        {timeLabel ? (
          <span className="mt-1 text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {timeLabel}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="group flex flex-col items-start">
      <div className="max-w-[min(92%,36rem)] min-w-0 rounded-[12px_12px_12px_2px] border border-border bg-secondary/60 px-4 py-3.5 text-[14px] leading-[1.7] text-foreground sm:max-w-[90%]">
        <MarkdownMessage text={text} />
      </div>
      <SourceChunks chunks={sources} />
      {timeLabel ? (
        <span className="mt-1 text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {timeLabel}
        </span>
      ) : null}
    </div>
  );
}
