import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/json";
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
  const storagePath = `${userId}/${id}.${fileType}`;

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

  return Response.json({
    documentId,
    status: "processing",
    chunkCount: null,
  });
}
