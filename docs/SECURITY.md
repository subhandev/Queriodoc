# Security model

## Authentication

- **Clerk** protects app pages via [`middleware.ts`](../middleware.ts) (`auth().protect()` on non-public routes).
- **API routes** authenticate per handler with `auth()` from `@clerk/nextjs/server` and return 401 when unauthenticated.

## Data access

- Server routes use **Supabase service role** ([`lib/supabase/server.ts`](../lib/supabase/server.ts)), which bypasses Row Level Security.
- Authorization is enforced in application code: every query filters by Clerk `userId`, and storage paths are prefixed with `{userId}/`.
- **Do not** expose `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` to the browser.

## Row Level Security (migrations 006–009)

RLS policies exist for optional **direct browser** access with a Clerk JWT in Supabase (`auth.jwt()->>'sub'`):

| Table     | Policy                                      |
|-----------|-----------------------------------------------|
| documents | SELECT own rows                               |
| messages  | SELECT own rows                               |
| chunks    | SELECT when parent document belongs to user   |

The current app does **not** use the browser Supabase client; RLS is defense-in-depth if you enable Clerk ↔ Supabase JWT later.

## Vector search

- `match_chunks` is scoped by `document_id`. The chat API verifies document ownership before calling the RPC.
- Similarity results below the threshold (default `0.35`) are excluded unless the fallback path returns the best top-K matches (migration `008`).

## Secrets on the client

Only these are intentionally public:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (unused by current UI; safe to omit if API-only)
