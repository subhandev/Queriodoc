# Queriodoc

**Chat with your documents.** Upload PDFs, Word files, or plain text, ask questions, and get streaming answers grounded in your content — with source citations from the original file.

**Live demo:** [queriodoc.vercel.app](https://queriodoc.vercel.app)

## Features

- **Multi-format upload** — PDF, `.docx`, and `.txt` via drag-and-drop or file picker
- **RAG pipeline** — Parse → chunk → embed (`text-embedding-3-small`) → pgvector similarity search → streamed answers (`gpt-4o`)
- **Source citations** — Assistant messages store matched chunk excerpts for transparency
- **Per-document chat** — Isolated threads with persisted history
- **Sample onboarding** — New users get a demo “Q3 Financial Summary” document to try chat before uploading
- **Auth** — Clerk sign-in/sign-up with protected dashboard and API routes

## How it works

```
Upload → Store (Supabase Storage) → Process (chunk + embed) → Chat (retrieve + stream)
```

1. **Upload** — `POST /api/ingest` (or `/api/upload`) saves the file to the private `documents` bucket and creates a `processing` row.
2. **Process** — `POST /api/documents/[documentId]/process` extracts text, chunks it, embeds, and marks the document `ready`. The client polls until complete.
3. **Chat** — `POST /api/chat` embeds the question, runs `match_chunks` (threshold `0.35`, with top-K fallback), and streams a context-only reply via the Vercel AI SDK.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Auth | [Clerk](https://clerk.com) |
| Database | [Supabase](https://supabase.com) — PostgreSQL + pgvector |
| Storage | Supabase Storage (`documents` bucket, private, per-user paths) |
| Embeddings | OpenAI `text-embedding-3-small` |
| Chat | OpenAI `gpt-4o` via [Vercel AI SDK](https://sdk.vercel.ai) (`streamText`, UI message stream) |
| Deployment | [Vercel](https://vercel.com) |

## Prerequisites

- **Node.js** ≥ 20.16 ([`package.json`](package.json) `engines`)
- Accounts: [Clerk](https://dashboard.clerk.com), [Supabase](https://supabase.com/dashboard), [OpenAI](https://platform.openai.com/api-keys)
- **Supabase CLI** (recommended) — [install guide](https://supabase.com/docs/guides/cli/getting-started)

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/subhandev/Queriodoc.git
cd Queriodoc
npm install
```

### 2. Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill in secret values from your Clerk, Supabase, and OpenAI dashboards. Clerk sign-in/up redirect URLs are pre-filled for this app’s routes.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Yes | Authentication |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Yes | Database + storage (server APIs) |
| `OPENAI_API_KEY` | Yes | Embeddings + chat |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Direct browser Supabase client (unused today) |

### 3. Database and storage

Apply **all** migrations in [`supabase/migrations/`](supabase/migrations/) (`001`–`013`).

**Recommended (CLI):** see [`docs/SUPABASE_CLI.md`](docs/SUPABASE_CLI.md).

```bash
supabase login
supabase link --project-ref <your-project-ref>
npm run db:push
```

**Alternative:** run each migration file in order in the Supabase SQL editor.

Notable migrations:

| Migration | Purpose |
|-----------|---------|
| `001`–`005` | pgvector, documents, chunks, messages, `match_chunks` RPC |
| `006`–`009` | Clerk RLS, storage bucket, threshold search, chunk RLS |
| `010` | Grants for `service_role` (used by API routes) |
| `011`–`012` | Sample documents, message `sources`, sample version tracking |
| `013` | Drop legacy IVFFlat index on chunks |

Migration `007` creates the private **`documents`** storage bucket.

Optional: configure Clerk as a Supabase third-party auth provider for direct browser queries — see [`docs/SECURITY.md`](docs/SECURITY.md). The app uses server-side API routes today; chat history does not require JWT setup.

### 4. Verify and run

```bash
npm run verify:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, open the sample document or upload a file, wait for processing, then chat.

## NPM scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run verify:setup` | Check required env vars |
| `npm run db:push` | Apply Supabase migrations to linked project |
| `npm run db:migrations` | List migration status |
| `npm run build:sample-embeddings` | Regenerate embeddings for the bundled sample doc (maintainers) |

## API routes

All routes require Clerk authentication (`401` if unauthenticated).

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ingest`, `/api/upload` | Upload file (`upload` re-exports `ingest`) |
| `POST` | `/api/documents/[documentId]/process` | Parse, chunk, embed; set document `ready` |
| `GET` | `/api/documents` | List current user's documents |
| `DELETE` | `/api/documents` | Delete all documents + storage for user |
| `GET` | `/api/documents/[documentId]` | Get one document |
| `DELETE` | `/api/documents/[documentId]` | Delete one document |
| `GET` | `/api/documents/[documentId]/messages` | Chat history |
| `DELETE` | `/api/documents/[documentId]/messages` | Clear chat for a document |
| `POST` | `/api/chat` | RAG chat (streaming UI message response) |
| `POST` | `/api/onboarding/sample` | Provision demo sample document for new users |

## Project structure

```
app/
  (auth)/          Sign-in, sign-up
  (dashboard)/     Documents list, upload
  (chat)/          Per-document chat UI
  api/             REST handlers (thin orchestration)
components/        UI (chat, upload, marketing, layout)
hooks/             useChat, useDocuments, useUpload, useOnboardingSample
lib/
  parsers/         PDF, DOCX, TXT extraction
  rag/             Chunking, embeddings, vector search, prompts
  onboarding/      Sample document provisioning
  supabase/        Admin + browser clients
supabase/migrations/
docs/              SECURITY.md, SUPABASE_CLI.md
scripts/           verify-setup, sample embeddings, dev utilities
```

## Deploy on Vercel

1. Import the repo and add the same variables as [`.env.example`](.env.example).
2. Run migrations `001`–`013` on your production Supabase project (`npm run db:push` against the linked project).
3. [`vercel.json`](vercel.json) sets 60s function timeouts for ingest, process, and chat routes.

## Security

Server routes use the Supabase **service role** and enforce ownership by Clerk `userId` in application code. See [`docs/SECURITY.md`](docs/SECURITY.md) for RLS, secrets, and vector search scoping.

## Scaling notes

For very large files or high volume, move document processing to a durable queue (Inngest, Trigger.dev, etc.). Upload and process are already separate API steps.

## License

Private — all rights reserved unless otherwise specified.
