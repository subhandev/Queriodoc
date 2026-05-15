import { auth } from "@clerk/nextjs/server";
import { jsonError } from "@/lib/api/json";
import {
  createAdminClient,
  formatPostgrestError,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

async function removeUserStorageObjects(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<void> {
  const { data: files, error } = await supabase.storage
    .from("documents")
    .list(userId, { limit: 1000 });

  if (error) {
    throw new Error(error.message);
  }

  const paths =
    files?.map((f) => `${userId}/${f.name}`).filter(Boolean) ?? [];
  if (paths.length === 0) {
    return;
  }

  const { error: rmErr } = await supabase.storage.from("documents").remove(paths);
  if (rmErr) {
    throw new Error(rmErr.message);
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return jsonError(formatPostgrestError(error), 500);
    }

    return Response.json(data ?? []);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return jsonError(message, 500);
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const supabase = createAdminClient();

    try {
      await removeUserStorageObjects(supabase, userId);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Storage delete failed";
      return jsonError(message, 500);
    }

    const { error } = await supabase.from("documents").delete().eq("user_id", userId);

    if (error) {
      return jsonError(formatPostgrestError(error), 500);
    }

    return new Response(null, { status: 204 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return jsonError(message, 500);
  }
}
