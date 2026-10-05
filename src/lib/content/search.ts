import "server-only";

import { nav } from "@/data/site";
import { normalizeArabic } from "@/lib/arabic";
import { isSlot, type TextValue } from "@/lib/placeholder";
import { getArchive, getArticles, getBooks, getHomeContent, getMoments, getSiteContent } from "./queries";
import type { SearchEntry, SearchHit } from "./types";

const real = (value: TextValue) => (isSlot(value) ? undefined : value);

/**
 * Everything on the site that carries real words. Slots are left out on
 * purpose — there is nothing to match against them yet.
 */
async function loadEntries(): Promise<SearchEntry[]> {
  const [{ person, stages }, moments, archive, articles, books, home] = await Promise.all([
    getSiteContent(),
    getMoments(),
    getArchive(),
    getArticles(),
    getBooks(),
    getHomeContent(),
  ]);

  const entries: SearchEntry[] = [
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
      href: moment.stageId ? `/biography#${moment.stageId}` : "/biography",
    })),
    ...home.about.paragraphs.map((paragraph, i) => ({
      id: `about-${i}`,
      title: home.about.name,
      kind: home.about.title,
      href: "/#about",
      body: paragraph,
    })),
  ];

  for (const article of articles) {
    const title = real(article.title);
    if (title) entries.push({ id: `article-${article.id}`, title, kind: "مقال", href: `/eye/${article.id}`, body: real(article.excerpt) });
  }
  for (const book of books) {
    const title = real(book.title);
    if (title) entries.push({ id: book.id, title, kind: "دار النشر", href: `/library#${book.id}`, body: real(book.summary) });
  }
  for (const speech of archive.speeches) {
    const title = real(speech.title);
    if (title) entries.push({ id: speech.id, title, kind: "خطاب", href: `/speeches#${speech.id}`, body: real(speech.excerpt) });
  }
  for (const item of archive.items) {
    const title = real(item.title);
    if (title && item.type !== "speech") entries.push({ id: item.id, title, kind: "أرشيف", href: `/archive#${item.id}` });
  }
  return entries.filter((entry) => entry.title);
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

export async function searchSite(query: string, limit = 12): Promise<SearchHit[]> {
  const tokens = normalizeArabic(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];

  const entries = await loadEntries();
  const scored: Array<{ hit: SearchHit; score: number }> = [];
  for (const entry of entries) {
    const title = normalizeArabic(entry.title);
    const body = normalizeArabic(`${entry.kind} ${entry.body ?? ""}`);
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
