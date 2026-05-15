"use client";

import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  SAMPLE_SUGGESTED_QUESTIONS,
  sampleChatWelcome,
} from "@/lib/onboarding/copy";
import { cn } from "@/lib/utils";

const DEFAULT_SUGGESTED = [
  "Summarise this document",
  "What are the key points?",
  "Who is this document for?",
];

type SuggestedQuestion = {
  label: string;
  hint?: string;
};

type ChatWelcomeProps = {
  documentName: string;
  isSample?: boolean;
  onSendQuestion: (question: string) => void;
  disabled?: boolean;
};

function SuggestedChips({
  questions,
  onSendQuestion,
  disabled,
}: {
  questions: SuggestedQuestion[];
  onSendQuestion: (question: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-5 flex flex-col items-center gap-2">
      {questions.map((q) => (
        <button
          key={q.label}
          type="button"
          disabled={disabled}
          onClick={() => onSendQuestion(q.label)}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-auto max-w-full flex-col items-start gap-0.5 px-3 py-2 text-left",
          )}
        >
          <span className="text-[13px]">{q.label}</span>
          {q.hint ? (
            <span className="text-[11px] font-normal text-muted-foreground">{q.hint}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function ChatWelcome({
  documentName,
  isSample = false,
  onSendQuestion,
  disabled = false,
}: ChatWelcomeProps) {
  const suggested: SuggestedQuestion[] = isSample
    ? SAMPLE_SUGGESTED_QUESTIONS.map((q) => ({
        label: q.label,
        hint: q.hint,
      }))
    : DEFAULT_SUGGESTED.map((label) => ({ label }));

  if (isSample) {
    return (
      <div className="mx-auto mt-10 max-w-[560px] rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(124,109,250,0.12)] text-primary">
          <MessageCircle size={20} />
        </div>
        <h2 className="text-[16px] font-semibold text-foreground">{sampleChatWelcome.headline}</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{sampleChatWelcome.body}</p>
        <p className="mt-3 text-[12px] text-muted-foreground/90">{sampleChatWelcome.trustLine}</p>
        <SuggestedChips
          questions={suggested}
          onSendQuestion={onSendQuestion}
          disabled={disabled}
        />
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
      <SuggestedChips
        questions={suggested}
        onSendQuestion={onSendQuestion}
        disabled={disabled}
      />
    </div>
  );
}
