import { cosineSimilarity, parseEmbedding } from "@/lib/rag/cosineSimilarity";
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

/**
 * Exact cosine ranking in app code. Used when match_chunks returns nothing
 * (broken IVFFlat on small corpora) or as a safety net.
 */
async function matchChunksExact(
  documentId: string,
  queryEmbedding: number[],
  topK: number,
  matchThreshold: number,
): Promise<MatchChunkRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("chunks")
    .select("content, chunk_index, embedding")
    .eq("document_id", documentId);

  if (error) {
    throw new Error(error.message);
  }
  if (!data?.length) {
    return [];
  }

  const scored = data.map((row) => ({
    content: row.content as string,
    chunk_index: row.chunk_index as number,
    similarity: cosineSimilarity(
      queryEmbedding,
      parseEmbedding(row.embedding),
    ),
  }));

  scored.sort((a, b) => b.similarity - a.similarity);

  const aboveThreshold =
    matchThreshold > 0
      ? scored.filter((row) => row.similarity >= matchThreshold)
      : scored;

  return (aboveThreshold.length > 0 ? aboveThreshold : scored).slice(0, topK);
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

  if (rows.length === 0) {
    rows = await matchChunksExact(
      documentId,
      queryEmbedding,
      topK,
      matchThreshold,
    );
    if (rows.length === 0 && matchThreshold > FALLBACK_SIMILARITY_THRESHOLD) {
      rows = await matchChunksExact(
        documentId,
        queryEmbedding,
        topK,
        FALLBACK_SIMILARITY_THRESHOLD,
      );
    }
  }

  return rows.map(({ content, chunk_index }) => ({ content, chunk_index }));
}
