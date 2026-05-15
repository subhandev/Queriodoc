import { createAdminClient } from "@/lib/supabase/server";
import type { MatchChunkRow } from "@/types";

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export async function storeChunks(
  documentId: string,
  chunks: string[],
  embeddings: number[][],
): Promise<void> {
  const supabase = createAdminClient();
  const rows = chunks.map((content, i) => ({
    document_id: documentId,
    content,
    chunk_index: i,
    embedding: toVectorLiteral(embeddings[i] ?? []),
  }));

  const { error } = await supabase.from("chunks").insert(rows);
  if (error) {
    throw new Error(error.message);
  }
}

/** Prefer chunks above this score; tuned for recall on short/vague queries. */
export const SIMILARITY_THRESHOLD = 0.35;

/** When nothing passes the primary threshold, still return the best top-K matches. */
const FALLBACK_SIMILARITY_THRESHOLD = 0;

async function matchChunks(
  documentId: string,
  queryEmbedding: number[],
  topK: number,
  matchThreshold: number,
): Promise<MatchChunkRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_document_id: documentId,
    match_count: topK,
    match_threshold: matchThreshold,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as MatchChunkRow[];
}

export async function similaritySearch(
  documentId: string,
  queryEmbedding: number[],
  topK: number = 5,
  matchThreshold: number = SIMILARITY_THRESHOLD,
): Promise<{ content: string; chunk_index: number }[]> {
  let rows = await matchChunks(
    documentId,
    queryEmbedding,
    topK,
    matchThreshold,
  );

  if (rows.length === 0 && matchThreshold > FALLBACK_SIMILARITY_THRESHOLD) {
    rows = await matchChunks(
      documentId,
      queryEmbedding,
      topK,
      FALLBACK_SIMILARITY_THRESHOLD,
    );
  }

  return rows.map(({ content, chunk_index }) => ({ content, chunk_index }));
}
