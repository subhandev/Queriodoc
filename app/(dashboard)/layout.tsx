import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { FileText } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar px-3 py-4 md:flex md:flex-col">
        <Link href="/documents" className="mb-8 flex items-center gap-2 px-2 font-semibold">
          <FileText className="size-6 text-sidebar-primary" />
          <span>Queriodoc</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          <Link
            href="/documents"
            className="rounded-md px-2 py-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            Documents
          </Link>
        </nav>
        <div className="mt-auto flex justify-center pt-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <Link href="/documents" className="font-semibold">
            Queriodoc
          </Link>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
