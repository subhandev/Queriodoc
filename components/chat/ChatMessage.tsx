"use client";

import type { QueriodocUIMessage } from "@/types";
import ReactMarkdown from "react-markdown";
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

type ChatMessageProps = {
  message: QueriodocUIMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const text = textFromParts(message);
  const sources = message.role === "assistant" ? sourcesFromParts(message) : [];
  const createdAt = message.metadata?.createdAt;
  const timeLabel = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-[13.5px] ${
          isUser
            ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-2xl rounded-tl-sm border border-border bg-secondary/60 text-foreground"
        }`}
      >
        {timeLabel && (
          <p
            className={`mb-1 text-[10px] uppercase tracking-wide ${
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {timeLabel}
          </p>
        )}
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="max-w-none text-sm leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 [&_code]:rounded [&_code]:bg-muted/80 [&_code]:px-1">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
        {!isUser && <SourceChunks chunks={sources} />}
      </div>
    </div>
  );
}
