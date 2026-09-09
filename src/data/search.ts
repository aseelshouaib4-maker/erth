import { about } from "./about";
import { moments, person, stages } from "./person";
import { nav } from "./site";

export type SearchEntry = {
  id: string;
  title: string;
  kind: string;
  href: string;
  body?: string;
};

/**
 * Everything on the site that carries real words. Placeholder titles are left
 * out on purpose — there is nothing to match against them yet.
 */
export const searchEntries: SearchEntry[] = [
  ...nav.map((item) => ({ id: `nav${item.href}`, title: item.label, kind: "قسم", href: item.href, body: item.note })),
  { id: "nav/volunteer", title: "تطوّع", kind: "قسم", href: "/volunteer", body: "استمارة طلب تطوّع والاختصاصات المطلوبة" },
  {
    id: "person",
    title: person.name,
    kind: "الشخصية",
    href: "/biography",
    body: `${person.storyTitle} ${person.birth.date} ${person.birth.place} ${person.death.date} ${person.death.place}`,
  },
  ...stages.map((stage) => ({
    id: `stage-${stage.id}`,
    title: stage.title,
    kind: `الفصل ${String(stage.index).padStart(2, "0")}${stage.period ? ` · ${stage.period}` : ""}`,
    href: `/biography#${stage.id}`,
    body: stage.body,
  })),
  ...moments.map((moment, i) => ({
    id: `moment-${i}`,
    title: moment.label,
    kind: `محطة · ${moment.date ?? moment.year}`,
    href: `/biography#${moment.stageId}`,
  })),
  ...about.paragraphs.map((paragraph, i) => ({
    id: `about-${i}`,
    title: about.name,
    kind: "من نحن",
    href: "/#about",
    body: paragraph,
  })),
];

/** Arabic search needs the obvious equivalences or nothing ever matches. */
export function normalizeArabic(value: string) {
  return value
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[«»"'.,:;!؟?()\[\]—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const indexed = searchEntries.map((entry) => ({
  entry,
  title: normalizeArabic(entry.title),
  body: normalizeArabic(`${entry.kind} ${entry.body ?? ""}`),
}));

export type SearchHit = SearchEntry & { snippet?: string };

export function searchSite(query: string, limit = 12): SearchHit[] {
  const tokens = normalizeArabic(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];

  const scored: Array<{ hit: SearchHit; score: number }> = [];
  for (const { entry, title, body } of indexed) {
    let score = 0;
    let matchesAll = true;
    for (const token of tokens) {
      if (title.includes(token)) score += title.startsWith(token) ? 6 : 4;
      else if (body.includes(token)) score += 1;
      else {
        matchesAll = false;
        break;
      }
    }
    if (matchesAll) scored.push({ hit: { ...entry, snippet: snippetFor(entry.body, tokens) }, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.hit);
}

/** a short window of the body around the first match, so the hit is legible */
function snippetFor(body: string | undefined, tokens: string[]) {
  if (!body) return undefined;
  const normalized = normalizeArabic(body);
  const at = normalized.indexOf(tokens[0]);
  if (at === -1) return body.length > 120 ? `${body.slice(0, 120)}…` : body;
  const start = Math.max(0, at - 45);
  const text = body.slice(start, start + 140).trim();
  return `${start > 0 ? "…" : ""}${text}${start + 140 < body.length ? "…" : ""}`;
}
