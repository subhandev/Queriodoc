export function buildPrompt(
  chunks: { content: string }[],
  chatHistory: { role: string; content: string }[],
  userQuery: string,
): string {
  const contextBlock = chunks.map((c) => c.content).join("\n\n---\n\n");

  const historyLines = chatHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  return `You are a helpful assistant that answers questions based strictly on the provided document context.
Only use information from the context below to answer. If the answer is not in the context, say "I couldn't find that information in the document."
Always be concise and accurate.

Prior conversation (most recent last):
${historyLines || "(none)"}

Current user question:
${userQuery}

Context:
${contextBlock}`;
}
