import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/json";
import { parseDocx } from "@/lib/parsers/docxParser";
import { parsePdf } from "@/lib/parsers/pdfParser";
import { parseTxt } from "@/lib/parsers/txtParser";
import { chunkText } from "@/lib/rag/chunker";
import { embedChunks } from "@/lib/rag/embedder";
import { storeChunks } from "@/lib/rag/vectorStore";
import { createAdminClient } from "@/lib/supabase/server";
import type { FileType } from "@/types";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;

function fileTypeFromName(name: string): FileType | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return "pdf";
  }
  if (lower.endsWith(".docx")) {
    return "docx";
  }
  if (lower.endsWith(".txt")) {
    return "txt";
  }
  return null;
}

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

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Invalid form data", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError("Missing file field", 400);
  }

  if (file.size > MAX_BYTES) {
    return jsonError("File too large. Maximum size is 10MB.", 400);
  }

  const fileType = fileTypeFromName(file.name);
  if (!fileType) {
    return jsonError("Invalid file type. Allowed: pdf, docx, txt.", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createAdminClient();
  const id = randomUUID();
  const ext = fileType;
  const storagePath = `${userId}/${id}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return jsonError(`Storage upload failed: ${uploadError.message}`, 500);
  }

  const { data: docRow, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      name: file.name,
      file_path: storagePath,
      file_type: fileType,
      status: "processing",
    })
    .select("id")
    .single();

  if (insertError || !docRow) {
    await supabase.storage.from("documents").remove([storagePath]);
    return jsonError(insertError?.message ?? "Failed to create document", 500);
  }

  const documentId = docRow.id as string;

  const markError = async () => {
    await supabase
      .from("documents")
      .update({ status: "error" })
      .eq("id", documentId);
  };

  try {
    const text = await extractText(buffer, fileType);
    const chunks = chunkText(text);
    if (chunks.length === 0) {
      await supabase
        .from("documents")
        .update({ status: "ready", chunk_count: 0 })
        .eq("id", documentId);
      return Response.json({ documentId, chunkCount: 0 });
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

    return Response.json({ documentId, chunkCount: chunks.length });
  } catch (e) {
    await markError();
    const message = e instanceof Error ? e.message : "Processing failed";
    return jsonError(message, 500);
  }
}
