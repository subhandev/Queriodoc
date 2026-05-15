export const SAMPLE_DOCUMENT_NAME = "Sample: Q3 Financial Summary (demo data)";

export const SAMPLE_SUGGESTED_QUESTIONS = [
  "What was the YoY revenue growth in Q3?",
  "Summarize the executive summary in 3 bullets",
  "Which segment grew fastest?",
  "What risks does the company call out?",
] as const;

export function getDocumentsPageSubtitle(hasSampleOnly: boolean): string {
  if (hasSampleOnly) {
    return "Your sample report is ready to chat with. When you're ready, upload a PDF, Word doc, or text file — we'll index it the same way.";
  }
  return "All your uploaded documents in one place.";
}

export const libraryBanner = {
  title: "Try Queriodoc with a sample report",
  body: "We added a ready-to-use Q3 financial summary with demo data so you can ask questions immediately — no upload needed. Open Sample: Q3 Financial Summary below, or upload your own document anytime. Your files stay private to your account.",
  cta: "Open sample chat",
} as const;

export const seedingCopy = {
  title: "Setting up your sample report…",
  subtitle: "This only happens once.",
} as const;

export const sampleCard = {
  badge: "Sample",
  subtitle: "Ready to chat · Synthetic demo data",
  helper: "Tap Open chat to ask about revenue, risks, and more.",
} as const;

export const emptyLibrary = {
  title: "No documents yet",
  body: "Upload a PDF, Word doc, or text file to start chatting with your own content. Drag and drop a file into the area above, or click it to browse.",
} as const;

export const sampleChatWelcome = {
  headline: "Your sample report is ready",
  body: "This is a synthetic Q3 financial summary with demo data — perfect for trying Queriodoc. Ask anything below; answers use only this document, with sources you can verify. When you're done exploring, upload your own file from the sidebar.",
  trustLine: "Demo data only · Your uploads are never shared",
} as const;

export const CLERK_METADATA_OPENED_KEY = "onboardingSampleOpenedAt";
