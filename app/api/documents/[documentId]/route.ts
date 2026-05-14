import { auth } from "@clerk/nextjs/server";
import { jsonError } from "@/lib/api/json";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RouteContext = { params: { documentId: string } };

export async function GET(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { documentId } = context.params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }
  if (!data) {
    return jsonError("Not found", 404);
  }

  return Response.json(data);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { documentId } = context.params;
  const supabase = createAdminClient();

  const { data: doc, error: fetchErr } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", documentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchErr) {
    return jsonError(fetchErr.message, 500);
  }
  if (!doc) {
    return jsonError("Not found", 404);
  }

  const filePath = doc.file_path as string;
  const { error: storageErr } = await supabase.storage.from("documents").remove([filePath]);
  if (storageErr) {
    return jsonError(storageErr.message, 500);
  }

  const { error: delErr } = await supabase.from("documents").delete().eq("id", documentId);

  if (delErr) {
    return jsonError(delErr.message, 500);
  }

  return new Response(null, { status: 204 });
}
