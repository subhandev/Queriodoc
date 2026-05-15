"use client";

import { MessageCircle } from "lucide-react";
import { SAMPLE_SUGGESTED_QUESTIONS, sampleChatWelcome } from "@/lib/onboarding/copy";

const DEFAULT_SUGGESTED = [
  "Summarise this document",
  "What are the key points?",
  "Who is this document for?",
];

type ChatWelcomeProps = {
  documentName: string;
  isSample?: boolean;
  onPick: (question: string) => void;
};

function SuggestedChips({
  questions,
  onPick,
}: {
  questions: string[];
  onPick: (question: string) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onPick(q)}
          className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.1)] bg-transparent px-3 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.03] hover:text-foreground"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

export function ChatWelcome({ documentName, isSample = false, onPick }: ChatWelcomeProps) {
  const suggested = isSample ? [...SAMPLE_SUGGESTED_QUESTIONS] : DEFAULT_SUGGESTED;

  if (isSample) {
    return (
      <div className="mx-auto mt-10 max-w-[560px] rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(124,109,250,0.12)] text-primary">
          <MessageCircle size={20} />
        </div>
        <h2 className="text-[16px] font-semibold text-foreground">{sampleChatWelcome.headline}</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{sampleChatWelcome.body}</p>
        <p className="mt-3 text-[12px] text-muted-foreground/90">{sampleChatWelcome.trustLine}</p>
        <SuggestedChips questions={suggested} onPick={onPick} />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-[520px] rounded-xl border border-border bg-card p-6 text-center">
      <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(124,109,250,0.12)] text-primary">
        <MessageCircle size={20} />
      </div>
      <h2 className="text-[16px] font-semibold text-foreground">
        Hi! I&apos;ve read {documentName}.
      </h2>
      <p className="mt-1.5 text-[13.5px] text-muted-foreground">
        Ask me anything about this document — I&apos;ll answer using only what&apos;s in it.
      </p>
      <SuggestedChips questions={suggested} onPick={onPick} />
    </div>
  );
}
