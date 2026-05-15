"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import type { QueriodocUIMessage } from "@/types";

type ChatWindowProps = {
  documentId: string;
  documentName: string;
};

function ChatHistorySkeleton() {
  return (
    <div className="flex flex-col gap-3 pr-2">
      <Skeleton className="ml-auto h-16 w-3/4 max-w-md rounded-2xl" />
      <Skeleton className="h-24 w-full max-w-lg rounded-2xl" />
      <Skeleton className="ml-auto h-12 w-2/3 max-w-sm rounded-2xl" />
    </div>
  );
}

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

  const uiMessages = messages as QueriodocUIMessage[];
  const showEmpty = historyLoaded && uiMessages.length === 0;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold leading-tight">{documentName}</h1>
        <p className="text-xs text-muted-foreground">
          Answers use RAG over your uploaded file.
        </p>
      </header>

      <ScrollArea className="flex-1 px-4 py-3">
        {!historyLoaded ? (
          <ChatHistorySkeleton />
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <MessageSquare className="size-10 text-muted-foreground/60" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Ask a question about this document. Answers are grounded in your
              uploaded content.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pr-2">
            {uiMessages.map((m) => (
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
