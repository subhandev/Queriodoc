import { parseDocx } from "@/lib/parsers/docxParser";
import { parsePdf } from "@/lib/parsers/pdfParser";
import { parseTxt } from "@/lib/parsers/txtParser";
import { chunkText } from "@/lib/rag/chunker";
import { embedChunks } from "@/lib/rag/embedder";
import { storeChunks } from "@/lib/rag/vectorStore";
import { createAdminClient } from "@/lib/supabase/server";
import type { FileType } from "@/types";

async function extractText(buffer: Buffer, fileType: FileType): Promise<string> {
  switch (fileType) {
    case "pdf":
      return parsePdf(buffer);
    case "docx":
      return parseDocx(buffer);
    case "txt":
      return parseTxt(buffer);
  }
}

export async function processDocument(
  documentId: string,
  userId: string,
): Promise<{ chunkCount: number }> {
  const supabase = createAdminClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id, file_path, file_type, status")
    .eq("id", documentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (docError) {
    throw new Error(docError.message);
  }
  if (!doc) {
    throw new Error("Document not found");
  }
  if (doc.status !== "processing") {
    return { chunkCount: 0 };
  }

  const markError = async () => {
    await supabase.from("documents").update({ status: "error" }).eq("id", documentId);
  };

  try {
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("documents")
      .download(doc.file_path);

    if (downloadError || !fileBlob) {
      throw new Error(downloadError?.message ?? "Failed to download file from storage");
    }

    const buffer = Buffer.from(await fileBlob.arrayBuffer());
    const fileType = doc.file_type as FileType;
    const text = await extractText(buffer, fileType);
    const chunks = chunkText(text);

    if (chunks.length === 0) {
      await supabase
        .from("documents")
        .update({ status: "ready", chunk_count: 0 })
        .eq("id", documentId);
      return { chunkCount: 0 };
    }

    const embeddings = await embedChunks(chunks);
    await storeChunks(documentId, chunks, embeddings);

    const { error: readyError } = await supabase
      .from("documents")
      .update({ status: "ready", chunk_count: chunks.length })
      .eq("id", documentId);

    if (readyError) {
      throw new Error(readyError.message);
    }

    return { chunkCount: chunks.length };
  } catch (e) {
    await markError();
    throw e;
  }
}
