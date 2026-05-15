"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Menu, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  onChatCleared?: () => void;
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

function textFromMessage(message: QueriodocUIMessage): string {
  return message.parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && "text" in p,
    )
    .map((p) => p.text)
    .join("");
}

export function ChatWindow({ documentId, document, onOpenMenu, onChatCleared }: ChatWindowProps) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    submitQuestion,
    isLoading,
    historyLoaded,
    stop,
    clearChatHistory,
  } = useChat(documentId);

  const uiMessages = messages as QueriodocUIMessage[];
  const canClear = historyLoaded && uiMessages.length > 0;
  const showEmpty = historyLoaded && uiMessages.length === 0;
  const lastMessage = uiMessages[uiMessages.length - 1];
  const lastAssistantText =
    lastMessage?.role === "assistant" ? textFromMessage(lastMessage) : "";
  const showTyping =
    isLoading &&
    (uiMessages.length === 0 ||
      lastMessage?.role === "user" ||
      (lastMessage?.role === "assistant" && !lastAssistantText.trim()));

  useEffect(() => {
    const el = scrollRootRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] px-4 md:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="md:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <span className="min-w-0 truncate text-[14px] font-medium text-foreground">
            {document.name}
          </span>
          <ChatTypeBadge type={document.file_type} className="hidden sm:inline-flex" />
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
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
            onClick={() => {
              setClearError(null);
              setClearOpen(true);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[rgba(248,113,113,0.1)] hover:text-[#F87171] disabled:opacity-40"
            aria-label="Clear chat history"
            disabled={!canClear || clearing}
            title={canClear ? "Clear chat history" : "No messages to clear"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <Dialog
        open={clearOpen}
        onOpenChange={(open) => {
          setClearOpen(open);
          if (!open) {
            setClearError(null);
          }
        }}
      >
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clear chat history?</DialogTitle>
            <DialogDescription>
              This removes every message in this document&apos;s chat for your account. You
              cannot undo this.
            </DialogDescription>
          </DialogHeader>
          {clearError ? (
            <p className="text-[13px] text-destructive" role="alert">
              {clearError}
            </p>
          ) : null}
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={clearing}
              onClick={() => setClearOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={clearing}
              onClick={async () => {
                setClearing(true);
                setClearError(null);
                try {
                  await clearChatHistory();
                  setClearOpen(false);
                  onChatCleared?.();
                } catch (e) {
                  setClearError(e instanceof Error ? e.message : "Something went wrong.");
                } finally {
                  setClearing(false);
                }
              }}
            >
              {clearing ? "Clearing…" : "Clear history"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showInfo ? (
        <>
          <button
            type="button"
            aria-label="Close info"
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setShowInfo(false)}
          />
          <aside className="fixed right-0 top-0 z-40 flex h-full w-full max-w-[min(100vw,340px)] flex-col border-l border-[rgba(255,255,255,0.06)] bg-[#111114] p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5">
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

      <div className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-4 md:px-0">
        <div ref={scrollRootRef} className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="py-6">
              {!historyLoaded ? (
                <ChatHistorySkeleton />
              ) : showEmpty ? (
                <ChatWelcome
                  documentName={document.name}
                  isSample={document.is_sample === true}
                  onSendQuestion={submitQuestion}
                  disabled={isLoading}
                />
              ) : (
                <div className="flex min-w-0 w-full flex-col gap-5">
                  {uiMessages.map((m) => (
                    <ChatMessage key={m.id} message={m} />
                  ))}
                  {showTyping ? <ChatTyping /> : null}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSubmit={() => handleSubmit()}
        onStop={stop}
        isLoading={isLoading || !historyLoaded}
      />
    </main>
  );
}
