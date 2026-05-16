import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SAMPLE_CONTENT_VERSION } from "@/lib/onboarding/copy";
import type { SampleDocumentPayload } from "@/lib/onboarding/sample-document.types";
import { createAdminClient } from "@/lib/supabase/server";

function loadSamplePayload(): SampleDocumentPayload {
  const path = join(process.cwd(), "lib/onboarding/sample-document.json");
  return JSON.parse(readFileSync(path, "utf8")) as SampleDocumentPayload;
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export async function refreshSampleChunksIfStale(
  userId: string,
  documentId: string,
  currentVersion: number | null | undefined,
): Promise<boolean> {
  const supabase = createAdminClient();
  const { count, error: countError } = await supabase
    .from("chunks")
    .select("id", { count: "exact", head: true })
    .eq("document_id", documentId);

  if (countError) {
    throw new Error(countError.message);
  }

  const hasChunks = (count ?? 0) > 0;
  if (currentVersion === SAMPLE_CONTENT_VERSION && hasChunks) {
    return false;
  }

  const payload = loadSamplePayload();

  const { error: deleteError } = await supabase
    .from("chunks")
    .delete()
    .eq("document_id", documentId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const chunkRows = payload.chunks.map((chunk) => ({
    document_id: documentId,
    content: chunk.content,
    chunk_index: chunk.chunk_index,
    embedding: toVectorLiteral(chunk.embedding),
  }));

  const { error: insertError } = await supabase.from("chunks").insert(chunkRows);
  if (insertError) {
    throw new Error(insertError.message);
  }

  const { error: updateError } = await supabase
    .from("documents")
    .update({
      chunk_count: payload.chunks.length,
      sample_content_version: SAMPLE_CONTENT_VERSION,
    })
    .eq("id", documentId)
    .eq("user_id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return true;
}
