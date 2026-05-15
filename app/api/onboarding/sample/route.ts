import { auth, clerkClient } from "@clerk/nextjs/server";
import { jsonError } from "@/lib/api/json";
import {
  hasOpenedSampleChat,
  markSampleChatOpened,
} from "@/lib/onboarding/clerk-metadata";
import { provisionSampleDocument } from "@/lib/onboarding/provisionSampleDocument";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const alreadyOpened = hasOpenedSampleChat(
      user.publicMetadata as Record<string, unknown> | undefined,
    );

    const { documentId, created } = await provisionSampleDocument(userId);

    if (!documentId) {
      return jsonError("Could not provision sample document", 500);
    }

    let shouldOpenSampleChat = false;
    if (!alreadyOpened) {
      shouldOpenSampleChat = true;
      await markSampleChatOpened(userId);
    }

    return Response.json({
      documentId,
      created,
      shouldOpenSampleChat,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return jsonError(message, 500);
  }
}
