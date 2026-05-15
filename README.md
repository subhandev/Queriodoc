# Queriodoc

**Chat with your documents. Powered by RAG.** Upload PDFs, Word files, or plain text, then ask questions and get streaming answers grounded in your own content.

![Screenshot placeholder](https://via.placeholder.com/1200x630/f4f4f5/171717?text=Queriodoc+screenshot)

## Tech stack

| Layer        | Technology |
|-------------|------------|
| Frontend    | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Auth        | Clerk |
| Database    | Supabase (PostgreSQL + pgvector) |
| Storage     | Supabase Storage (`documents` bucket, private) |
| Embeddings  | OpenAI `text-embedding-3-small` |
| Chat model  | OpenAI `gpt-4o` via Vercel AI SDK (`streamText`, UI message stream) |
| Deployment  | Vercel |

## Local setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd queriodoc
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Copy [`.env.example`](.env.example) to `.env.local` and fill in values from the Clerk, Supabase, and OpenAI dashboards.

4. **Supabase**

   **Recommended (CLI):** See [`docs/SUPABASE_CLI.md`](docs/SUPABASE_CLI.md).

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   npm run db:push
   ```

   **Alternative:** Run SQL migrations manually in the Supabase SQL editor (`001`–`009` in [`supabase/migrations/`](supabase/migrations/)).

   Migration `007_storage_bucket.sql` creates the private **`documents`** storage bucket.
   - Optional: configure **Clerk** as a Supabase third-party auth provider and JWT template `supabase` for direct browser queries (see [`docs/SECURITY.md`](docs/SECURITY.md)). Chat history uses `/api/documents/[id]/messages` and does not require this.

5. **Verify environment**

   ```bash
   npm run verify:setup
   ```

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## RAG pipeline (short)

1. **Upload** — `POST /api/ingest` or `POST /api/upload` stores the file in Supabase Storage and creates a `processing` document row.
2. **Process** — `POST /api/documents/[id]/process` parses, chunks, embeds, and marks the document `ready` (client polls until complete).
3. **Chat** — `POST /api/chat` embeds the question, calls `match_chunks` (similarity threshold 0.35, with top-K fallback), and streams GPT-4o with a strict context-only prompt.

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/ingest`, `/api/upload` | Upload file (alias) |
| POST | `/api/documents/[id]/process` | Chunk + embed document |
| GET | `/api/documents` | List user documents |
| GET/DELETE | `/api/documents/[id]` | Fetch or delete one document |
| GET | `/api/documents/[id]/messages` | Chat history |
| POST | `/api/chat` | RAG chat (streaming) |

## Deploy on Vercel

1. Import the repo and set the same variables as [`.env.example`](.env.example).
2. Apply Supabase migrations `001`–`009` on your linked project.
3. [`vercel.json`](vercel.json) sets longer timeouts for ingest/process/chat routes.
4. Update the demo URL below after your first production deploy.

## Production upgrade path

For very large files or high volume, move `process` to a durable queue (Inngest, Trigger.dev). The upload/process split is already in place.

## Live demo

**Demo:** [https://your-demo.vercel.app](https://your-demo.vercel.app) (replace with your deployment URL)

## Project layout

- **UI:** [`app/`](app/), [`components/`](components/)
- **API:** [`app/api/`](app/api/) — thin orchestration only
- **Core:** [`lib/parsers/`](lib/parsers/), [`lib/rag/`](lib/rag/)

## License

Private / your choice.
