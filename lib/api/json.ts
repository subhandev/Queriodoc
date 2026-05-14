import { NextResponse } from "next/server";
import type { ApiError } from "@/types";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message } satisfies ApiError, { status });
}
