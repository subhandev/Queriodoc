export type BuildPromptOptions = {
  isSample?: boolean;
};

export function buildPrompt(
  chunks: { content: string }[],
  chatHistory: { role: string; content: string }[],
  userQuery: string,
  options?: BuildPromptOptions,
): string {
  const contextBlock = chunks.map((c) => c.content).join("\n\n---\n\n");

  const historyLines = chatHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const styleInstructions = options?.isSample
    ? `Answer thoroughly using only the context below. Use 2–4 short paragraphs OR a bullet list with 4–6 items when covering multiple topics. Bold key metrics, dates, and names with markdown (**like this**). Include specific numbers from the document.`
    : `Be concise and accurate. Use short paragraphs and bullet lists when comparing multiple facts. Bold the most important numbers, dates, and names with markdown (**like this**). Avoid markdown headings unless the answer is long.`;

  return `You are a helpful assistant that answers questions based strictly on the provided document context.
Only use information from the context below to answer. If the context discusses the topic but does not fully answer the question, summarize what the document says about it. If the context does not relate to the question at all, say "I couldn't find that information in the document."
${styleInstructions}

Prior conversation (most recent last):
${historyLines || "(none)"}

Current user question:
${userQuery}

Context:
${contextBlock}`;
}
