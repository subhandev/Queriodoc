import Link from "next/link";
import {
  UploadCloud,
  MessageCircle,
  ShieldCheck,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";

function HeroMockup() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-2xl">
      <div
        aria-hidden
        className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[28px] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(124,109,250,0.35), transparent 70%)",
        }}
      />
      <div
        className="overflow-hidden rounded-2xl border border-border bg-card"
        style={{
          boxShadow:
            "0 0 0 1px rgba(124,109,250,0.18), 0 30px 80px -30px rgba(124,109,250,0.45)",
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-medium text-foreground">
                Q3-Financial-Report.pdf
              </div>
              <div className="text-[11px] text-muted-foreground">42 pages · Indexed</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            <span className="text-[11px] text-muted-foreground">Ready</span>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-[13.5px] text-primary-foreground">
              What was the YoY revenue growth in Q3?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2.5">
              <div className="rounded-2xl rounded-tl-sm border border-border bg-secondary/60 px-4 py-3 text-[13.5px] text-foreground">
                Q3 revenue grew{" "}
                <span className="font-medium text-primary">18.4% year-over-year</span>, reaching
                $42.1M — driven primarily by enterprise subscription expansion (+24%) and a 9%
                lift in average contract value.
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10.5px] text-muted-foreground">
                  <FileText className="h-3 w-3" /> Sources
                </span>
                <span className="rounded-md border border-border bg-card px-2 py-1 text-[10.5px] text-muted-foreground">
                  p. 4 · Revenue summary
                </span>
                <span className="rounded-md border border-border bg-card px-2 py-1 text-[10.5px] text-muted-foreground">
                  p. 12 · Segment breakdown
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-5 py-3.5">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
            <span className="text-[13px] text-muted-foreground">Ask another question…</span>
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ↵
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(124,109,250,0.18), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-[12px] font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Powered by RAG + GPT-4o
        </span>
        <h1 className="mt-6 text-[44px] font-semibold tracking-tight text-foreground sm:text-[56px]">
          Ask anything.
          <br />
          <span className="text-muted-foreground">From any document.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted-foreground sm:text-[18px]">
          Upload a PDF, Word doc, or text file — and get instant, accurate answers grounded in
          your content. No hallucinations. Just your document.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="inline-flex items-center rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-card"
          >
            See how it works
          </a>
        </div>
        <HeroMockup />
      </div>
    </section>
  );
}

export function ProofBar() {
  const tags = [
    "Legal contracts",
    "Research papers",
    "Financial reports",
    "Technical manuals",
  ];
  return (
    <section className="border-y border-border/60 bg-card/30 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2.5">
        <span className="mr-2 text-[13px] text-muted-foreground">Trusted for</span>
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-card px-3 py-1 text-[12px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: UploadCloud,
      title: "PDF, DOCX, TXT — all supported",
      desc: "Drag and drop any document. We handle the chunking, embedding, and indexing automatically.",
    },
    {
      icon: MessageCircle,
      title: "Ask in plain English",
      desc: "No special syntax or prompts. Just ask your question like you would a colleague.",
    },
    {
      icon: ShieldCheck,
      title: "Answers you can trust",
      desc: "Every response is grounded in your document with source references — no guessing, no hallucinations.",
    },
  ];
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-[32px] font-semibold tracking-tight text-foreground sm:text-[40px]">
          Everything you need to chat with your documents
        </h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors duration-150 hover:border-primary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-[16px] font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload your document",
      desc: "Drop in a PDF, DOCX, or TXT. We index it in seconds.",
    },
    {
      n: "02",
      title: "Ask a question",
      desc: "Type any question in natural language — no prompt tricks needed.",
    },
    {
      n: "03",
      title: "Get a grounded answer",
      desc: "Receive an accurate answer with citations from your file.",
    },
  ];
  return (
    <section id="how" className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-[32px] font-semibold tracking-tight text-foreground sm:text-[40px]">
          Up and running in 3 steps
        </h2>
        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-6 hidden md:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.15) 50%, transparent 50%)",
              backgroundSize: "8px 1px",
              backgroundRepeat: "repeat-x",
              height: "1px",
              marginLeft: "16%",
              marginRight: "16%",
            }}
          />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-[15px] font-semibold text-muted-foreground">
                {s.n}
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section id="cta" className="px-6 py-20">
      <div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-primary/40 bg-card p-12 text-center"
        style={{
          background:
            "radial-gradient(80% 120% at 50% 0%, rgba(124,109,250,0.18), rgba(22,22,26,1) 70%)",
        }}
      >
        <h2 className="text-[30px] font-semibold tracking-tight text-foreground sm:text-[36px]">
          Ready to talk to your documents?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
          Free to get started. No credit card required.
        </p>
        <Link
          href="/sign-up"
          className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)]"
        >
          Get started free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 text-[13px] text-muted-foreground">AI-powered document Q&A</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-[13px] text-muted-foreground">
          <a href="#" className="transition-colors duration-150 hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors duration-150 hover:text-foreground">
            Terms of Service
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
