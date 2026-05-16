"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  FileText,
  Loader2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { ChatTypeBadge } from "@/components/chat/ChatTypeBadge";
import { TruncatedText } from "@/components/ui/truncated-text";
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
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : (user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? "U");

  const displayName =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Account";

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }
    const onClick = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    globalThis.document.addEventListener("mousedown", onClick);
    return () => globalThis.document.removeEventListener("mousedown", onClick);
  }, [accountMenuOpen]);

  const avatarButton = (
    <button
      type="button"
      onClick={() => setAccountMenuOpen((v) => !v)}
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(255,255,255,0.12)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        collapsed ? "h-8 w-8" : "h-7 w-7",
      )}
      aria-expanded={accountMenuOpen}
      aria-haspopup="menu"
      aria-label="Account menu"
    >
      {user?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- Clerk-hosted avatar URL
        <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span
          className={cn(
            "flex h-full w-full items-center justify-center bg-white/[0.06] text-[11px] font-semibold text-foreground",
            collapsed && "text-[12px]",
          )}
        >
          {initials}
        </span>
      )}
    </button>
  );

  const accountDropdown = accountMenuOpen ? (
    <div
      className={cn(
        "absolute z-50 mb-2 w-[10.5rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111114] py-0.5 shadow-xl",
        collapsed ? "bottom-full left-1/2 -translate-x-1/2" : "bottom-full left-0",
      )}
      role="menu"
    >
      {!collapsed ? (
        <div className="border-b border-[rgba(255,255,255,0.06)] px-2.5 py-2">
          <p className="truncate text-[13px] font-medium text-foreground">{displayName}</p>
          {user?.primaryEmailAddress?.emailAddress ? (
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
              {user.primaryEmailAddress.emailAddress}
            </p>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-white/[0.04]"
        onClick={() => {
          setAccountMenuOpen(false);
          openUserProfile();
        }}
      >
        <UserRound size={15} className="shrink-0 text-muted-foreground" />
        Manage account
      </button>
      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-[13px] text-[#F87171] transition-colors hover:bg-white/[0.04]"
        onClick={() => {
          setAccountMenuOpen(false);
          void signOut({ redirectUrl: "/" });
        }}
      >
        <LogOut size={15} className="shrink-0" />
        Sign out
      </button>
    </div>
  ) : null;

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
                            <TruncatedText className="min-w-0 flex-1">
                              {doc.name}
                            </TruncatedText>
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
                "relative flex items-center gap-2.5",
                collapsed && "md:justify-center",
              )}
              ref={accountMenuRef}
            >
              {accountDropdown}
              {avatarButton}
              {!collapsed && (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate text-[12.5px] text-foreground">{displayName}</span>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((v) => !v)}
                    className="inline-flex shrink-0 items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground"
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="menu"
                  >
                    Menu
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
