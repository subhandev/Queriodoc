import { createBrowserClient } from "@supabase/ssr";

export function createClient(accessToken?: string | null) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers:
          accessToken != null && accessToken !== ""
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
      },
    },
  );
}
