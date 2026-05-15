# Supabase CLI setup (Queriodoc)

The CLI is installed via Homebrew (`supabase` v2.x). Use it to apply migrations from [`supabase/migrations/`](../supabase/migrations/) to your **remote** Supabase project (the one in `.env.local`).

## One-time setup

### 1. Log in

In a terminal (Cursor integrated terminal is fine):

```bash
supabase login
```

This opens a browser to authenticate with Supabase. When it succeeds, the CLI stores an access token locally.

### 2. Link this repo to your project

From the project root:

```bash
cd /Users/subhan/Work/Queriodoc
supabase link --project-ref rzbmrmlkivcbdthujccj
```

Use the **project ref** from your dashboard URL or from `NEXT_PUBLIC_SUPABASE_URL` (`https://<project-ref>.supabase.co`).

When prompted, enter your **database password** (Supabase Dashboard → Project Settings → Database). If you don’t have it, reset it there and try again.

This creates `supabase/.temp/project-ref` (gitignored) so the CLI knows which remote DB to target.

### 3. Push migrations

```bash
supabase db push
```

Applies any migration in `supabase/migrations/` that is not yet recorded on the remote database (`001` through `009`).

Confirm:

```bash
supabase migration list
```

You should see all migrations as applied on the linked remote.

## Day-to-day commands

| Command | Purpose |
|---------|---------|
| `supabase migration list` | See which migrations are applied locally vs remote |
| `supabase db push` | Apply new migration files to the linked remote project |
| `supabase db pull <name>` | After schema changes in dashboard, pull into a new migration file |
| `supabase db diff -f <name>` | Generate a migration from local vs remote diff |
| `npm run db:push` | Shortcut for `supabase db push` |

## Optional: local Supabase (Docker)

To run Postgres + Studio locally (not required for Queriodoc if you only use hosted Supabase):

```bash
supabase start
supabase stop
```

Requires Docker Desktop.

## Troubleshooting

- **“Access token not provided”** → Run `supabase login` again.
- **“project not linked”** → Run `supabase link --project-ref <ref>`.
- **Push fails on storage bucket** → Migration `007` inserts into `storage.buckets`; ensure you use a role with permission (linked project uses your DB password).
- **Password wrong** → Reset in Dashboard → Settings → Database, then re-run `supabase link`.

## Security

- Never commit `.env.local` or database passwords.
- `supabase link` stores connection info under `supabase/.temp/` (gitignored).
