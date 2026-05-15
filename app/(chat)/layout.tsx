export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-svh w-full overflow-hidden bg-background text-foreground">
      {children}
    </div>
  );
}
