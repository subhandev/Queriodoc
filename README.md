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

   - Create a project and run SQL migrations in order from [`supabase/migrations/`](supabase/migrations/) (or use the Supabase CLI: `supabase db reset` / `supabase migration up`).
   - Create a **private** storage bucket named `documents`.
   - Optional: configure **Clerk** as a Supabase third-party auth provider and add a JWT template named `supabase` if you add direct browser Supabase queries (see migration `006_clerk_rls.sql`). Chat history is loaded via `/api/documents/[id]/messages` and does not require this template.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## RAG pipeline (short)

Documents are parsed into text, split into overlapping word chunks, and embedded with OpenAI. Vectors are stored in Postgres; at question time the user query is embedded, nearest chunks are retrieved with `match_chunks`, and a strict system prompt feeds GPT-4o so answers stay on-document.

## Production upgrade path

In production, the ingest pipeline would move to an async queue (Inngest, Trigger.dev, or similar) to handle large documents without serverless timeout constraints.

## Live demo

**Demo:** [https://your-demo.vercel.app](https://your-demo.vercel.app) (replace with your deployment URL)

## Project layout

- **UI:** [`app/`](app/), [`components/`](components/)
- **API:** [`app/api/`](app/api/) — thin orchestration only
- **Core:** [`lib/parsers/`](lib/parsers/), [`lib/rag/`](lib/rag/)

## License

Private / your choice.
