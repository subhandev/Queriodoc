"use client";

import { useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Same account pattern as chat sidebar — avoids Clerk UserButton popover width/layout issues.
 */
export function NavAccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : (user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? "U");

  const displayName =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Account";
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!open) {
      return;
    }
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    globalThis.document.addEventListener("mousedown", onClick);
    return () => globalThis.document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative flex min-w-0 max-w-full items-center gap-2.5 sm:gap-3"
    >
      <div className="min-w-0 max-w-[min(14rem,calc(100vw-12rem))] text-right md:max-w-xs">
        <p className="truncate text-[13px] font-medium leading-tight text-foreground">{displayName}</p>
        {email && email !== displayName ? (
          <p className="mt-0.5 truncate text-[11.5px] leading-tight text-muted-foreground">{email}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(255,255,255,0.12)] transition-opacity hover:opacity-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Clerk-hosted avatar URL
          <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-white/[0.06] text-[12px] font-semibold text-foreground">
            {initials}
          </span>
        )}
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-[100] mt-2 w-[min(12rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111114] py-0.5 shadow-xl"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-white/[0.04]"
            onClick={() => {
              setOpen(false);
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
              setOpen(false);
              void signOut({ redirectUrl: "/" });
            }}
          >
            <LogOut size={15} className="shrink-0" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
