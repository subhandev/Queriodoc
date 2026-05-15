/**
 * Generates lib/onboarding/sample-document.json from content/sample-q3-financial-summary.txt
 * Requires OPENAI_API_KEY in env (loads .env.local via dotenv if present).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
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
  } catch {
    /* optional */
  }
}

const CHUNK_WORDS = 500;
const OVERLAP_WORDS = 50;
const MIN_CHUNK_WORDS = 50;
const STEP = CHUNK_WORDS - OVERLAP_WORDS;

function chunkText(text) {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (words.length === 0) return [];
  if (words.length <= MIN_CHUNK_WORDS) return [words.join(" ")];

  const chunks = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + CHUNK_WORDS, words.length);
    const slice = words.slice(start, end);
    const isLast = end >= words.length;
    if (slice.length >= MIN_CHUNK_WORDS || isLast) {
      chunks.push(slice.join(" "));
    }
    if (isLast) break;
    start += STEP;
  }
  return chunks;
}

async function embedChunks(openai, chunks) {
  const BATCH_SIZE = 20;
  const all = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch,
    });
    for (const item of res.data.sort((a, b) => a.index - b.index)) {
      all.push(item.embedding);
    }
  }
  return all;
}

async function main() {
  loadEnvLocal();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is required to build sample embeddings.");
    process.exit(1);
  }

  const textPath = join(root, "content/sample-q3-financial-summary.txt");
  const text = readFileSync(textPath, "utf8");
  const chunks = chunkText(text);
  console.log(`Chunked sample document into ${chunks.length} chunk(s).`);

  const openai = new OpenAI({ apiKey });
  const embeddings = await embedChunks(openai, chunks);

  const out = {
    name: "Sample: Q3 Financial Summary (demo data)",
    fileType: "txt",
    chunks: chunks.map((content, i) => ({
      content,
      chunk_index: i,
      embedding: embeddings[i],
    })),
  };

  const outPath = join(root, "lib/onboarding/sample-document.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
