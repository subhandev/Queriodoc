/**
 * Smoke-test similaritySearch against Supabase (uses .env.local).
 * Run: node scripts/test-similarity-search.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const BROAD =
  /\b(summar(?:y|ise|ize|izing|ising)|overview|main points?|key points?|highlights?|tl;?dr|big picture|takeaways?|what(?:'s| is) this (?:document|report|file) about|what does this (?:document|report) (?:say|cover|discuss)|strategic|gist)\b/i;
const SUFFIX =
  "\n\nFocus on: executive summary, revenue, margins, segments, cash, product launches, risks, outlook, management priorities, and strategic direction.";

function buildEmbeddingInput(q) {
  return BROAD.test(q) ? `${q.trim()}${SUFFIX}` : q;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function matchChunksExact(url, key, documentId, queryEmbedding, topK, matchThreshold) {
  const res = await fetch(
    `${url}/rest/v1/chunks?document_id=eq.${documentId}&select=content,chunk_index,embedding`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  const data = await res.json();
  const scored = data
    .map((row) => ({
      chunk_index: row.chunk_index,
      content: row.content,
      similarity: cosineSimilarity(
        queryEmbedding,
        JSON.parse(row.embedding),
      ),
    }))
    .sort((a, b) => b.similarity - a.similarity);
  const above =
    matchThreshold > 0
      ? scored.filter((r) => r.similarity >= matchThreshold)
      : scored;
  return (above.length > 0 ? above : scored).slice(0, topK);
}

async function matchChunksRpc(url, key, documentId, queryEmbedding, topK, matchThreshold) {
  const res = await fetch(`${url}/rest/v1/rpc/match_chunks`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query_embedding: queryEmbedding,
      match_document_id: documentId,
      match_count: topK,
      match_threshold: matchThreshold,
    }),
  });
  return res.json();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const docsRes = await fetch(
  `${url}/rest/v1/documents?is_sample=eq.true&select=id&limit=1`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
);
const [doc] = await docsRes.json();
if (!doc?.id) {
  console.error("No sample document found");
  process.exit(1);
}

const query = "Summarise this report ?";
const emb = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: buildEmbeddingInput(query),
});
const queryEmbedding = emb.data[0].embedding;

const rpcRows = await matchChunksRpc(url, key, doc.id, queryEmbedding, 5, 0);
const exactRows = await matchChunksExact(url, key, doc.id, queryEmbedding, 5, 0.35);

console.log("Query:", query);
console.log("RPC match_chunks (threshold 0):", Array.isArray(rpcRows) ? rpcRows.length : rpcRows);
console.log(
  "Exact fallback (threshold 0.35):",
  exactRows.length,
  exactRows.map((r) => `${r.chunk_index}@${r.similarity.toFixed(3)}`).join(", "),
);

if (exactRows.length === 0) {
  process.exit(1);
}
