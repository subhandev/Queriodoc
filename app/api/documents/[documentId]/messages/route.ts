import { auth } from "@clerk/nextjs/server";
import { jsonError } from "@/lib/api/json";
import { createAdminClient, formatPostgrestError } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RouteContext = { params: { documentId: string } };

export async function GET(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { documentId } = context.params;
  const supabase = createAdminClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (docError) {
    return jsonError(formatPostgrestError(docError), 500);
  }
  if (!doc) {
    return jsonError("Not found", 404);
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, document_id, user_id, role, content, sources, created_at")
    .eq("document_id", documentId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return jsonError(formatPostgrestError(error), 500);
  }

  return Response.json(data ?? []);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { documentId } = context.params;
  const supabase = createAdminClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (docError) {
    return jsonError(formatPostgrestError(docError), 500);
  }
  if (!doc) {
    return jsonError("Not found", 404);
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("document_id", documentId)
    .eq("user_id", userId);

  if (error) {
    return jsonError(formatPostgrestError(error), 500);
  }

  return new Response(null, { status: 204 });
}
