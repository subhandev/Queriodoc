/** Broad/meta questions embed poorly against domain-specific chunks; expand for search. */
const BROAD_QUERY_PATTERN =
  /\b(summar(?:y|ise|ize|izing|ising)|overview|main points?|key points?|highlights?|tl;?dr|big picture|takeaways?|what(?:'s| is) this (?:document|report|file) about|what does this (?:document|report) (?:say|cover|discuss)|strategic|gist)\b/i;

const EMBEDDING_FOCUS_SUFFIX = `

Focus on: executive summary, revenue, margins, segments, cash, product launches, risks, outlook, management priorities, and strategic direction.`;

export function isBroadDocumentQuery(query: string): boolean {
  return BROAD_QUERY_PATTERN.test(query);
}

/** Text sent to the embedding model for similarity search (may differ from the user's question). */
export function buildEmbeddingInput(userQuery: string): string {
  if (!isBroadDocumentQuery(userQuery)) {
    return userQuery;
  }
  return `${userQuery.trim()}${EMBEDDING_FOCUS_SUFFIX}`;
}
