import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileSearch, MessageSquare, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/40">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold">Queriodoc</span>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Sign in
            </Link>
            <Link href="/sign-up" className={cn(buttonVariants())}>
              Get started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/documents"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              My documents
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-1 flex-col items-center px-6 pb-24 pt-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          RAG on your own files
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Chat with your documents.
          <span className="text-primary"> Powered by RAG.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
          Upload PDFs, Word docs, or plain text. Ask natural-language questions and get
          concise answers grounded in your content—not generic web fluff.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <SignedOut>
            <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }))}>
              Get started
            </Link>
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/documents" className={cn(buttonVariants({ size: "lg" }))}>
              Go to documents
            </Link>
          </SignedIn>
        </div>

        <ul className="mt-20 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
          <li className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <FileSearch className="mb-3 size-8 text-primary" />
            <h2 className="font-semibold">Upload any PDF</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Drag-and-drop PDF, DOCX, or TXT. We chunk, embed, and index it in Postgres
              with pgvector.
            </p>
          </li>
          <li className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <MessageSquare className="mb-3 size-8 text-primary" />
            <h2 className="font-semibold">Ask questions</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each reply uses semantic search over your document, then streams from GPT-4o
              with tight instructions to stay on-source.
            </p>
          </li>
          <li className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Shield className="mb-3 size-8 text-primary" />
            <h2 className="font-semibold">Grounded answers</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              When the answer is not in the document, the assistant says so—reducing
              confident hallucinations.
            </p>
          </li>
        </ul>
      </main>
    </div>
  );
}
