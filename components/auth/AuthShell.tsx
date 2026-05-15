import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 sm:py-10">
      <div className="w-full max-w-[420px]">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <Logo />
            <div className="space-y-1.5">
              <h1 className="text-[20px] font-semibold leading-tight text-foreground">
                {title}
              </h1>
              <p className="text-[14px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="mt-7">{children}</div>
        </div>
        <p className="mt-6 text-center text-[14px] text-muted-foreground">{footer}</p>
      </div>
    </main>
  );
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[12px] text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function authInputClass(hasError?: boolean) {
  return cn(
    "block h-11 w-full rounded-lg bg-background px-3 text-[15px] text-foreground",
    "placeholder:text-muted-foreground/70",
    "border transition-all duration-150 outline-none",
    hasError
      ? "border-destructive focus:border-destructive"
      : "border-[rgba(255,255,255,0.1)] focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,109,250,0.18)]",
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[12px] uppercase tracking-wider text-muted-foreground">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function GoogleButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-transparent px-3 text-[14px] font-medium text-foreground transition-colors duration-150 hover:bg-white/[0.03] disabled:opacity-60"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}

export function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.92v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.92A9 9 0 0 0 0 9c0 1.45.35 2.82.92 4.05l3.05-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .92 4.95L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
