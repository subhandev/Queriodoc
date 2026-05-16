export const SAMPLE_DOCUMENT_NAME = "Sample: Q3 Financial Summary (demo data)";

/** Bump when sample text/chunks change — triggers chunk refresh for existing users. */
export const SAMPLE_CONTENT_VERSION = 2;

export const SAMPLE_SUGGESTED_QUESTIONS = [
  {
    label: "Summarize Q3 revenue, margins, key segments, and cash",
    hint: "Pulls from several sections of the report",
  },
  {
    label: "Compare enterprise, SMB, and public sector performance",
    hint: "Revenue mix and year-over-year growth",
  },
  {
    label: "Summarize major risks and management mitigation strategies",
    hint: "Principal risks and management responses",
  },
  {
    label: "What's the outlook on costs, margins, and Q4?",
    hint: "Operating expenses and profitability trends",
  },
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
} as const;

export const emptyLibrary = {
  title: "No documents yet",
  body: "Upload a PDF, Word doc, or text file to start chatting with your own content. Drag and drop a file into the area above, or click it to browse.",
} as const;

export const sampleChatWelcome = {
  headline: "Your sample report is ready",
  body: "This is a synthetic Q3 financial summary with demo data — Ask anything or pick a starter question below to see rich, sourced answers.",
  trustLine: "Your uploads remain private",
} as const;

export const CLERK_METADATA_OPENED_KEY = "onboardingSampleOpenedAt";
