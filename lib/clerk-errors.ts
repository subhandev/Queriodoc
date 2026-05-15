import type { ClerkAPIError } from "@clerk/types";

export function getClerkErrorMessage(
  errors: ClerkAPIError[] | undefined,
  field?: string,
): string | undefined {
  if (!errors?.length) return undefined;
  const match = field
    ? errors.find((e) => e.meta?.paramName === field)
    : errors[0];
  const err = match ?? errors[0];
  return err.longMessage ?? err.message;
}
