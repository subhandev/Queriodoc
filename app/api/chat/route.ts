import { createOpenAI } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { jsonError } from "@/lib/api/json";
import { getOpenAI } from "@/lib/openai/client";
import { buildPrompt } from "@/lib/rag/promptBuilder";
import { similaritySearch } from "@/lib/rag/vectorStore";
import { createAdminClient } from "@/lib/supabase/server";
import type { QueriodocUIMessage } from "@/types";

export const runtime = "nodejs";

function textFromUIMessage(message: UIMessage): string {
  return message.parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && "text" in p,
    )
    .map((p) => p.text)
    .join("");
}

function lastUserMessage(messages: UIMessage[]): UIMessage | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === "user") {
      return messages[i];
    }
  }
  return undefined;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const documentId =
    typeof body === "object" &&
    body !== null &&
    "documentId" in body &&
    typeof (body as { documentId: unknown }).documentId === "string"
      ? (body as { documentId: string }).documentId
      : null;

  const messagesRaw =
    typeof body === "object" &&
    body !== null &&
    "messages" in body &&
    Array.isArray((body as { messages: unknown }).messages)
      ? (body as { messages: UIMessage[] }).messages
      : null;

  if (!documentId) {
    return jsonError("Missing documentId", 400);
  }
  if (!messagesRaw) {
    return jsonError("Missing messages", 400);
  }

  const lastUser = lastUserMessage(messagesRaw);
  if (!lastUser) {
    return jsonError("No user message found", 400);
  }

  const userText = textFromUIMessage(lastUser).trim();
  if (!userText) {
    return jsonError("Empty message", 400);
  }

  const supabase = createAdminClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (docError || !doc) {
    return jsonError("Forbidden", 403);
  }

  const { data: historyRows, error: histError } = await supabase
    .from("messages")
    .select("role, content")
    .eq("document_id", documentId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (histError) {
    return jsonError(histError.message, 500);
  }

  const history = (historyRows ?? [])
    .reverse()
    .map((row) => ({
      role: row.role as string,
      content: row.content as string,
    }));

  let queryEmbedding: number[];
  try {
    const emb = await getOpenAI().embeddings.create({
      model: "text-embedding-3-small",
      input: userText,
    });
    const v = emb.data[0]?.embedding;
    if (!v) {
      throw new Error("No embedding returned");
    }
    queryEmbedding = v;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Embedding failed";
    return jsonError(message, 500);
  }

  let matched: { content: string; chunk_index: number }[];
  try {
    matched = await similaritySearch(documentId, queryEmbedding, 5);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Similarity search failed";
    return jsonError(message, 500);
  }

  const systemPrompt = buildPrompt(matched, history, userText);

  const { error: userInsErr } = await supabase.from("messages").insert({
    document_id: documentId,
    user_id: userId,
    role: "user",
    content: userText,
  });

  if (userInsErr) {
    return jsonError(userInsErr.message, 500);
  }

  const openaiProvider = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const stream = createUIMessageStream<QueriodocUIMessage>({
    execute: ({ writer }) => {
      writer.write({
        type: "data-sources",
        id: "retrieval",
        data: { chunks: matched },
      });

      const result = streamText({
        model: openaiProvider("gpt-4o"),
        messages: [{ role: "system", content: systemPrompt }],
      });

      writer.merge(result.toUIMessageStream());
    },
    onFinish: async ({ responseMessage }) => {
      const assistantText = textFromUIMessage(responseMessage);
      await supabase.from("messages").insert({
        document_id: documentId,
        user_id: userId,
        role: "assistant",
        content: assistantText,
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
