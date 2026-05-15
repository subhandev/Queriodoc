"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Menu, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ChatTyping } from "@/components/chat/ChatTyping";
import { ChatTypeBadge } from "@/components/chat/ChatTypeBadge";
import { useChat } from "@/hooks/useChat";
import type { DocumentRow, QueriodocUIMessage } from "@/types";

type ChatWindowProps = {
  documentId: string;
  document: DocumentRow;
  onOpenMenu: () => void;
};

function ChatHistorySkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="ml-auto h-14 w-[55%] max-w-md rounded-[12px]" />
      <Skeleton className="h-20 w-[70%] max-w-lg rounded-[12px]" />
      <Skeleton className="ml-auto h-12 w-[45%] max-w-sm rounded-[12px]" />
    </div>
  );
}

export function ChatWindow({ documentId, document, onOpenMenu }: ChatWindowProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    historyLoaded,
  } = useChat(documentId);

  const uiMessages = messages as QueriodocUIMessage[];
  const showEmpty = historyLoaded && uiMessages.length === 0;
  const showTyping =
    isLoading && uiMessages.length > 0 && uiMessages[uiMessages.length - 1]?.role === "user";

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <span className="truncate text-[14px] font-medium text-foreground">
            {document.name}
          </span>
          <ChatTypeBadge type={document.file_type} />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Document info"
          >
            <Info size={16} />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[rgba(248,113,113,0.1)] hover:text-[#F87171] disabled:opacity-40"
            aria-label="Clear chat history"
            disabled
            title="Clear chat coming soon"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {showInfo ? (
        <>
          <button
            type="button"
            aria-label="Close info"
            className="fixed inset-0 z-30 bg-black/40 md:left-[260px]"
            onClick={() => setShowInfo(false)}
          />
          <aside className="fixed right-0 top-0 z-40 flex h-full w-full max-w-[340px] flex-col border-l border-[rgba(255,255,255,0.06)] bg-[#111114] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-foreground">Document info</h3>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="text-[13px] text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <dl className="mt-5 space-y-4 text-[13px]">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Name</dt>
                <dd className="mt-1 break-words text-foreground">{document.name}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Type</dt>
                <dd className="mt-1 text-foreground">{document.file_type.toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Messages
                </dt>
                <dd className="mt-1 text-foreground">{document.message_count ?? 0}</dd>
              </div>
            </dl>
          </aside>
        </>
      ) : null}

      <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[720px] px-4 py-6 md:px-6">
          {!historyLoaded ? (
            <ChatHistorySkeleton />
          ) : showEmpty ? (
            <ChatWelcome documentName={document.name} onPick={setInput} />
          ) : (
            <div className="flex flex-col gap-5">
              {uiMessages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {showTyping ? <ChatTyping /> : null}
            </div>
          )}
        </div>
      </div>

      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSubmit={() => handleSubmit()}
        isLoading={isLoading || !historyLoaded}
      />
    </main>
  );
}
