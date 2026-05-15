import { createClient } from "@supabase/supabase-js";
import type { PostgrestError } from "@supabase/supabase-js";

export function formatPostgrestError(error: PostgrestError): string {
  const parts = [error.message, error.hint].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  const msg = error.message ?? "";
  if (msg.includes("does not exist") || msg.includes("schema cache")) {
    parts.push("Apply database migrations in supabase/migrations/ to this project.");
  }
  return parts.join(" ");
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.",
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
