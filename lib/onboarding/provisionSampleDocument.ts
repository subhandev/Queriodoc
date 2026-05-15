import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { SAMPLE_DOCUMENT_NAME } from "@/lib/onboarding/copy";
import type { SampleDocumentPayload } from "@/lib/onboarding/sample-document.types";

function loadSamplePayload(): SampleDocumentPayload {
  const path = join(process.cwd(), "lib/onboarding/sample-document.json");
  return JSON.parse(readFileSync(path, "utf8")) as SampleDocumentPayload;
}

function loadSampleFileBuffer(): Buffer {
  const path = join(process.cwd(), "content/sample-q3-financial-summary.txt");
  return readFileSync(path);
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export type ProvisionSampleResult = {
  documentId: string;
  created: boolean;
};

export async function provisionSampleDocument(
  userId: string,
): Promise<ProvisionSampleResult> {
  const supabase = createAdminClient();

  const { count, error: countError } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }
  if ((count ?? 0) > 0) {
    const { data: existing } = await supabase
      .from("documents")
      .select("id")
      .eq("user_id", userId)
      .eq("is_sample", true)
      .maybeSingle();

    if (existing?.id) {
      return { documentId: existing.id as string, created: false };
    }

    const { data: first } = await supabase
      .from("documents")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    return {
      documentId: (first?.id as string) ?? "",
      created: false,
    };
  }

  const payload = loadSamplePayload();
  const documentId = randomUUID();
  const storagePath = `${userId}/${documentId}.txt`;
  const fileBuffer = loadSampleFileBuffer();

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, fileBuffer, {
      contentType: "text/plain",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { error: insertError } = await supabase.from("documents").insert({
    id: documentId,
    user_id: userId,
    name: payload.name || SAMPLE_DOCUMENT_NAME,
    file_path: storagePath,
    file_type: payload.fileType,
    status: "ready",
    chunk_count: payload.chunks.length,
    is_sample: true,
  });

  if (insertError) {
    await supabase.storage.from("documents").remove([storagePath]);
    throw new Error(insertError.message);
  }

  const chunkRows = payload.chunks.map((chunk) => ({
    document_id: documentId,
    content: chunk.content,
    chunk_index: chunk.chunk_index,
    embedding: toVectorLiteral(chunk.embedding),
  }));

  const { error: chunksError } = await supabase.from("chunks").insert(chunkRows);

  if (chunksError) {
    await supabase.from("documents").delete().eq("id", documentId);
    await supabase.storage.from("documents").remove([storagePath]);
    throw new Error(chunksError.message);
  }

  return { documentId, created: true };
}
