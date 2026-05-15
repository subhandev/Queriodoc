"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-primary">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline-offset-2 hover:underline"
    >
      {children}
    </a>
  ),
  h2: ({ children }) => (
    <h2 className="mb-1.5 mt-3 text-[15px] font-semibold text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-2 text-[14px] font-semibold text-foreground first:mt-0">
      {children}
    </h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={cn("text-[12.5px]", className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-white/[0.06] px-1 py-0.5 text-[12.5px]"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 max-w-full overflow-x-auto rounded-md bg-white/[0.04] p-3 text-[12.5px]">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-2 max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-white/[0.04] px-2 py-1 text-left font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-2 py-1">{children}</td>
  ),
};

const NOT_FOUND_PHRASE = "I couldn't find that information in the document.";

type MarkdownMessageProps = {
  text: string;
  className?: string;
};

export function MarkdownMessage({ text, className }: MarkdownMessageProps) {
  const isNotFound = text.trim().includes(NOT_FOUND_PHRASE);

  return (
    <div
      className={cn(
        "max-w-none break-words",
        isNotFound &&
          "rounded-md border border-dashed border-border/80 bg-muted/30 px-3 py-2 text-muted-foreground",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
