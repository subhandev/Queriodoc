import { clerkClient } from "@clerk/nextjs/server";
import { CLERK_METADATA_OPENED_KEY } from "@/lib/onboarding/copy";

export function hasOpenedSampleChat(
  publicMetadata: Record<string, unknown> | undefined,
): boolean {
  return Boolean(publicMetadata?.[CLERK_METADATA_OPENED_KEY]);
}

export async function markSampleChatOpened(userId: string): Promise<void> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existing = (user.publicMetadata ?? {}) as Record<string, unknown>;

  if (existing[CLERK_METADATA_OPENED_KEY]) {
    return;
  }

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...existing,
      [CLERK_METADATA_OPENED_KEY]: new Date().toISOString(),
    },
  });
}
