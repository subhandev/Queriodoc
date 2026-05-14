import { getOpenAI } from "@/lib/openai/client";

const BATCH_SIZE = 20;

export async function embedChunks(chunks: string[]): Promise<number[][]> {
  const all: number[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const res = await getOpenAI().embeddings.create({
      model: "text-embedding-3-small",
      input: batch,
    });
    for (const item of res.data.sort((a, b) => a.index - b.index)) {
      all.push(item.embedding);
    }
  }
  return all;
}
