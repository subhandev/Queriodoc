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

export async function similaritySearch(
  documentId: string,
  queryEmbedding: number[],
  topK: number = 5,
): Promise<{ content: string; chunk_index: number }[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_document_id: documentId,
    match_count: topK,
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as MatchChunkRow[];
  return rows.map(({ content, chunk_index }) => ({ content, chunk_index }));
}
