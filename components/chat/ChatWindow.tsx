"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import type { QueriodocUIMessage } from "@/types";

type ChatWindowProps = {
  documentId: string;
  documentName: string;
};

export function ChatWindow({ documentId, documentName }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    historyLoaded,
  } = useChat(documentId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold leading-tight">{documentName}</h1>
        <p className="text-xs text-muted-foreground">Answers use RAG over your uploaded file.</p>
      </header>

      <ScrollArea className="flex-1 px-4 py-3">
        {!historyLoaded ? (
          <p className="text-sm text-muted-foreground">Loading conversation…</p>
        ) : (
          <div className="flex flex-col gap-3 pr-2">
            {(messages as QueriodocUIMessage[]).map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSubmit={() => handleSubmit()}
        isLoading={isLoading || !historyLoaded}
      />
    </div>
  );
}
