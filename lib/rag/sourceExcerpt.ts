/** Strip demo banner and bracketed disclaimers at the start of chunk text. */
const LEADING_DISCLAIMER =
  /^(?:\[[^\]]{8,120}\]\s*)+|^(?:\(demo[^)]*\)\s*)+/i;

/** Section titles common in reports (sample + generic uploads). */
const KNOWN_SECTION =
  /\b(EXECUTIVE SUMMARY|REVENUE PERFORMANCE|SEGMENT RESULTS|PRODUCT AND CUSTOMER HIGHLIGHTS|OPERATING EXPENSES AND PROFITABILITY|OPERATING EXPENSES|CASH AND BALANCE SHEET|CASH AND BALANCE|OUTLOOK AND RISKS|KEY PERFORMANCE INDICATORS|KEY PERFORMANCE|CUSTOMER SUCCESS STORIES|CUSTOMER SUCCESS|PUBLIC SECTOR AND PARTNERSHIPS|PUBLIC SECTOR|MANAGEMENT DISCUSSION)\b/;

export function stripSourceBoilerplate(content: string): string {
  let text = content.replace(/\s+/g, " ").trim();
  let prev = "";
  while (text !== prev) {
    prev = text;
    text = text.replace(LEADING_DISCLAIMER, "").trim();
  }
  return text;
}

/** Short label for a source pill (section title when detectable). */
export function sourceLabel(content: string): string | null {
  const cleaned = stripSourceBoilerplate(content);
  const known = cleaned.match(KNOWN_SECTION);
  if (known?.[1]) {
    const title = known[1];
    return title.length > 40 ? `${title.slice(0, 40)}…` : title;
  }

  const caps = cleaned.match(/\b([A-Z][A-Z0-9 ,/&—-]{10,48})\b/);
  if (caps?.[1]) {
    const title = caps[1].trim();
    const words = title.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return title.length > 40 ? `${title.slice(0, 40)}…` : title;
    }
  }

  return null;
}

/** Preview line for source chips — skips boilerplate so pills differ by section. */
export function sourceExcerpt(content: string, max = 48): string {
  const label = sourceLabel(content);
  if (label) {
    return label;
  }

  const cleaned = stripSourceBoilerplate(content);
  if (cleaned.length <= max) {
    return cleaned;
  }
  return `${cleaned.slice(0, max).trim()}…`;
}
