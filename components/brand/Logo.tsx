import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex h-2.5 w-2.5">
        <span className="absolute inset-0 rounded-full bg-primary" />
        <span className="absolute inset-0 rounded-full bg-primary opacity-70 blur-[6px]" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-foreground">
        Queriodoc
      </span>
    </Link>
  );
}
