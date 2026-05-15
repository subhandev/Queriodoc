import { auth } from "@clerk/nextjs/server";
import { jsonError } from "@/lib/api/json";
import { processDocument } from "@/lib/rag/processDocument";

export const runtime = "nodejs";
export const maxDuration = 300;

type RouteContext = { params: { documentId: string } };

export async function POST(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { documentId } = context.params;

  try {
    const { chunkCount } = await processDocument(documentId, userId);
    return Response.json({ documentId, status: "ready", chunkCount });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Processing failed";
    return jsonError(message, 500);
  }
}
