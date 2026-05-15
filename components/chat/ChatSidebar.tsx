"use client";

import Link from "next/link";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  FileText,
  Loader2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  X,
} from "lucide-react";
import { ChatTypeBadge } from "@/components/chat/ChatTypeBadge";
import { cn } from "@/lib/utils";
import type { DocumentRow } from "@/types";

type ChatSidebarProps = {
  documents: DocumentRow[];
  currentDocumentId: string;
  isLoading?: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export function ChatSidebar({
  documents,
  currentDocumentId,
  isLoading,
  mobileOpen,
  onMobileOpenChange,
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : (user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? "U");

  const displayName =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Account";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => onMobileOpenChange(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-[rgba(255,255,255,0.06)] bg-[#111114] transition-[transform,width] duration-200 ease-out md:static md:translate-x-0",
          collapsed ? "w-[260px] md:w-16" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] px-3">
          <Link href="/documents" className="inline-flex min-w-0 items-center gap-2">
            <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inset-0 rounded-full bg-primary" />
              <span className="absolute inset-0 rounded-full bg-primary opacity-70 blur-[6px]" />
            </span>
            {!collapsed && (
              <span className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                Queriodoc
              </span>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
            <button
              type="button"
              onClick={() => onMobileOpenChange(false)}
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-2 py-3">
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                My Documents
              </div>
            )}
            {isLoading ? (
              <p className="px-3 py-3 text-xs text-muted-foreground">Loading…</p>
            ) : documents.length === 0 ? (
              <p className="px-3 py-3 text-xs text-muted-foreground">No documents yet.</p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {documents.map((doc) => {
                  const active = doc.id === currentDocumentId;
                  return (
                    <li key={doc.id}>
                      <Link
                        href={`/documents/${doc.id}`}
                        onClick={() => onMobileOpenChange(false)}
                        title={collapsed ? doc.name : undefined}
                        className={cn(
                          "group relative flex h-10 items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors",
                          active
                            ? "bg-[rgba(124,109,250,0.15)] text-primary"
                            : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                          collapsed && "md:justify-center md:px-0",
                        )}
                      >
                        {active && !collapsed ? (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-primary" />
                        ) : null}
                        <FileText size={15} className="shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="min-w-0 flex-1 truncate">{doc.name}</span>
                            {doc.status === "processing" ? (
                              <Loader2 className="size-3.5 shrink-0 animate-spin" />
                            ) : (
                              <ChatTypeBadge type={doc.file_type} size="xs" />
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] p-3">
            <Link
              href="/documents"
              className={cn(
                "mb-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-transparent text-[13px] font-medium text-foreground transition-colors hover:bg-white/[0.04]",
                collapsed ? "md:px-0" : "px-3",
              )}
            >
              <Plus size={14} className="shrink-0" />
              {!collapsed && <span>Upload new document</span>}
            </Link>
            <div
              className={cn(
                "flex items-center gap-2.5",
                collapsed && "md:justify-center",
              )}
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-semibold text-foreground">
                {initials}
              </span>
              {!collapsed && (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate text-[12.5px] text-foreground">{displayName}</span>
                  <button
                    type="button"
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground"
                    aria-label="Sign out"
                  >
                    <LogOut size={12} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
