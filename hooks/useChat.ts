"use client";

import { useAuth } from "@clerk/nextjs";
import { useChat as useAIChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MessageRow, QueriodocUIMessage, SourceChunkPreview } from "@/types";

function rowToUIMessage(row: MessageRow): QueriodocUIMessage {
  const parts: QueriodocUIMessage["parts"] = [{ type: "text", text: row.content }];
  if (row.sources?.chunks && row.sources.chunks.length > 0) {
    parts.push({
      type: "data-sources",
      id: "retrieval",
      data: { chunks: row.sources.chunks },
    });
  }
  return {
    id: row.id,
    role: row.role,
    metadata: { createdAt: row.created_at },
    parts,
  };
}

export function useChat(documentId: string) {
  const { userId, isLoaded } = useAuth();
  const [input, setInput] = useState("");
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<QueriodocUIMessage>({
        api: "/api/chat",
        body: { documentId },
      }),
    [documentId],
  );

  const { messages, sendMessage, status, setMessages, stop } = useAIChat<QueriodocUIMessage>({
    id: documentId,
    transport,
  });

  useEffect(() => {
    if (!isLoaded || !userId) {
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      setHistoryLoaded(false);
      const res = await fetch(`/api/documents/${documentId}/messages`, {
        credentials: "include",
      });

      if (cancelled) {
        return;
      }
      if (!res.ok) {
        console.error("Failed to load chat history", await res.text());
        setMessages([]);
        setHistoryLoaded(true);
        return;
      }
      const rows = (await res.json()) as MessageRow[];
      setMessages(rows.map(rowToUIMessage));
      setHistoryLoaded(true);
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [documentId, userId, isLoaded, setMessages]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const isLoading = status === "streaming" || status === "submitted";

  const submitQuestion = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) {
        return;
      }
      void sendMessage({ text: trimmed });
      setInput("");
    },
    [isLoading, sendMessage],
  );

  const handleSubmit = useCallback(
    (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      submitQuestion(input);
    },
    [input, submitQuestion],
  );

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    submitQuestion,
    isLoading,
    historyLoaded,
    stop,
  };
}
