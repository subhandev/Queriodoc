export const SAMPLE_DOCUMENT_NAME = "Sample: Q3 Financial Summary (demo data)";

/** Bump when sample text/chunks change — triggers chunk refresh for existing users. */
export const SAMPLE_CONTENT_VERSION = 2;

export const SAMPLE_SUGGESTED_QUESTIONS = [
  {
    label: "Give me a full Q3 overview: revenue, margins, segments, and cash position",
    hint: "Uses multiple sections",
  },
  {
    label: "Compare enterprise, SMB, and public sector — revenue share and YoY growth",
    hint: "Segment breakdown",
  },
  {
    label: "List all principal risks and management's mitigation strategies",
    hint: "Risks & outlook",
  },
  {
    label: "Walk through operating expenses, profitability trends, and Q4 outlook",
    hint: "Financial depth",
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
  helper: "Click anywhere on the card to start chatting",
} as const;

export const emptyLibrary = {
  title: "No documents yet",
  body: "Upload a PDF, Word doc, or text file to start chatting with your own content. Drag and drop a file into the area above, or click it to browse.",
} as const;

export const sampleChatWelcome = {
  headline: "Your sample report is ready",
  body: "This is a synthetic Q3 financial summary with demo data — perfect for trying Queriodoc. Pick a starter question below to see rich, sourced answers. When you're done exploring, upload your own file from the sidebar.",
  trustLine: "Demo data only · Your uploads are never shared",
} as const;

export const CLERK_METADATA_OPENED_KEY = "onboardingSampleOpenedAt";
