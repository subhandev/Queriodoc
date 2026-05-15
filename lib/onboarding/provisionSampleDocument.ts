import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { SAMPLE_CONTENT_VERSION, SAMPLE_DOCUMENT_NAME } from "@/lib/onboarding/copy";
import { refreshSampleChunksIfStale } from "@/lib/onboarding/refreshSampleChunks";
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

function isMissingColumnOrSchemaCacheError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    (m.includes("could not find") && m.includes("column"))
  );
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
    const existingQuery = await supabase
      .from("documents")
      .select("id, sample_content_version")
      .eq("user_id", userId)
      .eq("is_sample", true)
      .maybeSingle();

    let sampleDocId: string | undefined;
    /** False when DB has no `sample_content_version` column yet (migration not applied). */
    let sampleVersionTracked = false;
    let sampleContentVersion: number | null | undefined;

    if (
      existingQuery.error &&
      isMissingColumnOrSchemaCacheError(existingQuery.error.message)
    ) {
      console.warn(
        "[provisionSampleDocument] sample_content_version not in DB schema cache; run migration 012_message_sources_and_sample_version.sql. Skipping demo chunk refresh.",
      );
      const fallback = await supabase
        .from("documents")
        .select("id")
        .eq("user_id", userId)
        .eq("is_sample", true)
        .maybeSingle();
      if (fallback.error) {
        throw new Error(fallback.error.message);
      }
      sampleDocId = fallback.data?.id ?? undefined;
    } else if (existingQuery.error) {
      throw new Error(existingQuery.error.message);
    } else if (existingQuery.data?.id) {
      sampleDocId = existingQuery.data.id;
      sampleVersionTracked = true;
      sampleContentVersion = existingQuery.data.sample_content_version;
    }

    if (sampleDocId) {
      if (sampleVersionTracked) {
        await refreshSampleChunksIfStale(userId, sampleDocId, sampleContentVersion);
      }
      return { documentId: sampleDocId, created: false };
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

  const insertBase = {
    id: documentId,
    user_id: userId,
    name: payload.name || SAMPLE_DOCUMENT_NAME,
    file_path: storagePath,
    file_type: payload.fileType,
    status: "ready" as const,
    chunk_count: payload.chunks.length,
    is_sample: true,
  };

  let insertError = (
    await supabase.from("documents").insert({
      ...insertBase,
      sample_content_version: SAMPLE_CONTENT_VERSION,
    })
  ).error;

  if (insertError && isMissingColumnOrSchemaCacheError(insertError.message)) {
    console.warn(
      "[provisionSampleDocument] Insert without sample_content_version — apply migration 012_message_sources_and_sample_version.sql when possible.",
    );
    ({ error: insertError } = await supabase.from("documents").insert(insertBase));
  }

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
