/**
 * Formatting shared by the content mappers. Dates and numbers follow the style
 * guide: Levantine month names, Western digits.
 */

const dateFormat = new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** `2024-09-27T…` → «27 أيلول 2024» */
export function formatDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : dateFormat.format(date);
}

/** Arabic counted noun for minutes: 1, 2, 3–10, 11+ each take a different form. */
export function minutesLabel(n: number): string {
  if (n <= 1) return "دقيقة واحدة";
  if (n === 2) return "دقيقتان";
  if (n <= 10) return `${n} دقائق`;
  return `${n} دقيقة`;
}

const WORDS_PER_MINUTE = 200;

type LexicalNode = { text?: unknown; children?: unknown };

/** Plain text of a Lexical rich-text value, for reading time and search. */
export function lexicalText(value: unknown): string {
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const { text, children } = node as LexicalNode;
    if (typeof text === "string") parts.push(text);
    if (Array.isArray(children)) children.forEach(walk);
  };
  walk((value as { root?: unknown } | null | undefined)?.root);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function readingTime(text: string): string | undefined {
  const words = text ? text.split(" ").length : 0;
  return words ? minutesLabel(Math.max(1, Math.round(words / WORDS_PER_MINUTE))) : undefined;
}
