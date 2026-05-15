"use client";

import { useAuth } from "@clerk/nextjs";
import { useChat as useAIChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MessageRow, QueriodocUIMessage } from "@/types";

function rowToUIMessage(row: MessageRow): QueriodocUIMessage {
  return {
    id: row.id,
    role: row.role,
    metadata: { createdAt: row.created_at },
    parts: [{ type: "text", text: row.content }],
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      const trimmed = input.trim();
      if (!trimmed || status === "streaming" || status === "submitted") {
        return;
      }
      void sendMessage({ text: trimmed });
      setInput("");
    },
    [input, sendMessage, status],
  );

  const isLoading = status === "streaming" || status === "submitted";

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    historyLoaded,
    stop,
  };
}
