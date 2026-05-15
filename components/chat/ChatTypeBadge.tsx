import { cn } from "@/lib/utils";
import type { FileType } from "@/types";

const styles: Record<FileType, string> = {
  pdf: "bg-[rgba(248,113,113,0.12)] text-[#F87171]",
  docx: "bg-[rgba(96,165,250,0.12)] text-[#60A5FA]",
  txt: "bg-[rgba(167,139,250,0.14)] text-[#A78BFA]",
};

type ChatTypeBadgeProps = {
  type: FileType;
  size?: "xs" | "sm";
  className?: string;
};

export function ChatTypeBadge({ type, size = "sm", className }: ChatTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-semibold tracking-wide",
        size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        styles[type],
        className,
      )}
    >
      {type.toUpperCase()}
    </span>
  );
}
