import "server-only";

import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload, type CollectionSlug, type Where } from "payload";
import { cache } from "react";
import type * as CMS from "@/payload-types";
import {
  speechAsArchiveItem,
  toAbout,
  toArchiveItem,
  toArticle,
  toBook,
  toGalleryItem,
  toHeroSlide,
  toHomeVideo,
  toMoment,
  toPageIntros,
  toPerson,
  toSiteSettings,
  toSpeech,
  toStage,
} from "./mappers";
import { CONTENT_TAG, contentTag } from "./tags";
import type { ArchiveItem, HomeContent, SiteContent } from "./types";

/**
 * Every read the site makes from the CMS. Results are cached and tagged; the
 * collection hooks invalidate the tags on publish (see payload/hooks/revalidate).
 * Reads go through access control as an anonymous visitor, so drafts never leak.
 */

const payload = () => getPayload({ config });

const PUBLISHED: Where = { _status: { equals: "published" } };

/** Wraps a loader in the data cache (across requests) and React's cache (within one render). */
function cached<Args extends unknown[], Result>(
  key: string,
  tags: string[],
  load: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return cache(unstable_cache(load, [key], { tags: [CONTENT_TAG, ...tags.map(contentTag)] }));
}

async function findAll<Slug extends CollectionSlug>(
  collection: Slug,
  { sort, drafts = true, depth = 1 }: { sort: string; drafts?: boolean; depth?: number },
) {
  const result = await (
    await payload()
  ).find({
    collection,
    sort,
    depth,
    pagination: false,
    overrideAccess: false,
    draft: false,
    where: drafts ? PUBLISHED : undefined,
  });
  return result.docs;
}

async function findGlobal<Slug extends "site-settings" | "person" | "about" | "home-page" | "page-intros">(
  slug: Slug,
  depth = 1,
) {
  return (await payload()).findGlobal({ slug, depth, overrideAccess: false });
}

/* ------------------------------------------------------------- site-wide */

const loadStages = async () => {
  const docs = (await findAll("stages", { sort: "_order", depth: 2 })) as CMS.Stage[];
  return docs.map(toStage);
};

export const getStages = cached("stages", ["stages"], loadStages);

export const getSiteContent = cached(
  "site-content",
  ["stages", "person", "site-settings"],
  async (): Promise<SiteContent> => {
    const [stages, person, settings] = await Promise.all([
      loadStages(),
      findGlobal("person"),
      findGlobal("site-settings", 0),
    ]);
    return { stages, person: toPerson(person as CMS.Person), settings: toSiteSettings(settings as CMS.SiteSetting) };
  },
);

export const getMoments = cached("moments", ["moments", "stages"], async () => {
  const docs = (await findAll("moments", { sort: "year", drafts: false })) as CMS.Moment[];
  return docs.map(toMoment);
});

/* --------------------------------------------------------------- archive */

const loadSpeeches = async () => {
  const docs = (await findAll("speeches", { sort: "_order", depth: 2 })) as CMS.Speech[];
  return docs.map(toSpeech);
};

export const getSpeeches = cached("speeches", ["speeches", "stages"], loadSpeeches);

const loadArchiveDocs = async () => (await findAll("archive-items", { sort: "year", depth: 2 })) as CMS.ArchiveItem[];

/** Photos, videos and texts, then the speeches as the fourth type. */
export const getArchive = cached("archive", ["archive-items", "speeches", "stages"], async () => {
  const [docs, speeches] = await Promise.all([loadArchiveDocs(), loadSpeeches()]);
  const byType = (type: CMS.ArchiveItem["type"]) => docs.filter((d) => d.type === type);
  const items: ArchiveItem[] = [
    ...byType("photo").map(toArchiveItem),
    ...byType("video").map(toArchiveItem),
    ...byType("text").map(toArchiveItem),
    ...speeches.map(speechAsArchiveItem),
  ];
  return { items, speeches };
});

/* -------------------------------------------------------------- articles */

export const getArticles = cached("articles", ["articles"], async () => {
  const docs = (await findAll("articles", { sort: "-publishedAt" })) as CMS.Article[];
  return docs.map(toArticle);
});

/** One article with its rich-text body, or null when it does not exist or is unpublished. */
export const getArticle = cached("article", ["articles"], async (id: string) => {
  if (!/^\d+$/.test(id)) return null;
  const { docs } = await (
    await payload()
  ).find({
    collection: "articles",
    where: { and: [PUBLISHED, { id: { equals: Number(id) } }] },
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    draft: false,
  });
  const article = docs[0] as CMS.Article | undefined;
  return article ? { article: toArticle(article), body: article.body ?? null } : null;
});

/* ----------------------------------------------------------------- books */

export const getBooks = cached("books", ["books"], async () => {
  const docs = (await findAll("books", { sort: "_order" })) as CMS.Book[];
  return docs.map(toBook);
});

/* --------------------------------------------------------------- gallery */

export const getGallery = cached("gallery", ["gallery", "stages"], async () => {
  const docs = (await findAll("gallery", { sort: "_order" })) as CMS.Gallery[];
  return docs.map(toGalleryItem);
});

/* ------------------------------------------------------------------ home */

const pick = <T extends { id: string }>(chosen: string[], all: T[], fallback: T[]) => {
  const byId = new Map(all.map((item) => [item.id, item]));
  const picked = chosen.map((id) => byId.get(id)).filter((item): item is T => item !== undefined);
  return picked.length ? picked : fallback;
};

const relIds = (values: Array<number | { id: number }> | null | undefined, prefix: string) =>
  (values ?? []).map((v) => `${prefix}${typeof v === "object" ? v.id : v}`);

export const getHomeContent = cached(
  "home",
  ["home-page", "hero-slides", "archive-items", "speeches", "articles", "books", "about", "stages"],
  async (): Promise<HomeContent> => {
    const [home, slides, archive, articles, books, about] = await Promise.all([
      findGlobal("home-page", 0),
      findAll("hero-slides", { sort: "_order" }),
      getArchive(),
      getArticles(),
      getBooks(),
      findGlobal("about", 0),
    ]);
    const homePage = home as CMS.HomePage;
    const photos = archive.items.filter((item) => item.type === "photo");
    const videos = archive.items.filter((item) => item.type === "video");
    return {
      slides: (slides as CMS.HeroSlide[]).map(toHeroSlide),
      speeches: pick(relIds(homePage.speeches, "speech-"), archive.speeches, archive.speeches.slice(0, 5)),
      photos: pick(relIds(homePage.photos, "archive-"), photos, photos),
      videos: pick(relIds(homePage.videos, "archive-"), videos, videos.slice(-3).reverse()).map(toHomeVideo),
      articles: articles.slice(0, 3),
      books: books.slice(0, 4),
      about: toAbout(about as CMS.About),
    };
  },
);

/* ----------------------------------------------------------------- pages */

export const getPageIntros = cached("page-intros", ["page-intros"], async () =>
  toPageIntros((await findGlobal("page-intros", 0)) as CMS.PageIntro),
);
