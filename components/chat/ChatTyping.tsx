export function ChatTyping() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-[12px_12px_12px_2px] border border-[rgba(255,255,255,0.07)] bg-[#1E1E24] px-4 py-3">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
        </div>
      </div>
      <span className="text-[12px] text-muted-foreground">Queriodoc is thinking…</span>
    </div>
  );
}
