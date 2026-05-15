"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TruncatedTextProps = {
  children: string;
  className?: string;
};

/** Truncates with ellipsis; shows a native tooltip only when text overflows. */
export function TruncatedText({ children, className }: TruncatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <span
      ref={ref}
      className={cn("truncate", className)}
      title={isTruncated ? children : undefined}
    >
      {children}
    </span>
  );
}
