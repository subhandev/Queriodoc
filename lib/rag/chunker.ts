const CHUNK_WORDS = 500;
const OVERLAP_WORDS = 50;
const MIN_CHUNK_WORDS = 50;
const STEP = CHUNK_WORDS - OVERLAP_WORDS;

function tokenizeWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

export function chunkText(text: string): string[] {
  const words = tokenizeWords(text);
  if (words.length === 0) {
    return [];
  }

  if (words.length <= MIN_CHUNK_WORDS) {
    return [words.join(" ")];
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + CHUNK_WORDS, words.length);
    const slice = words.slice(start, end);
    const isLast = end >= words.length;

    if (slice.length >= MIN_CHUNK_WORDS || isLast) {
      chunks.push(slice.join(" "));
    }

    if (isLast) {
      break;
    }
    start += STEP;
  }

  return chunks;
}
