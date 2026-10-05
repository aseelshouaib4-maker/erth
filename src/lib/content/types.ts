import type { ImageAsset, MediaRef, TextValue } from "@/lib/placeholder";

/**
 * The shapes the site renders. CMS documents are mapped into these on the
 * server (see `mappers.ts`), so components never depend on the CMS schema.
 */

export type Stage = {
  /** the stage slug — used in anchors such as /biography#najaf */
  id: string;
  /** 1-based chapter number, from the order set in the admin */
  index: number;
  period?: string;
  yearFrom?: number;
  yearTo?: number;
  title: string;
  body: string;
  longBody: TextValue;
  /** never empty: a placeholder stands in until media is attached */
  media: MediaRef[];
  caption: TextValue;
};

export type Moment = { year: number; label: string; stageId?: string; date?: string };

export type ArchiveType = "photo" | "video" | "text" | "speech";
export type VideoKind = "interview" | "lecture";
export type ArchiveSize = "sm" | "md" | "lg" | "tall" | "wide";

export type ArchiveItem = {
  id: string;
  type: ArchiveType;
  title: TextValue;
  stageId?: string;
  year?: number;
  /** grid footprint */
  size: ArchiveSize;
  /** videos only */
  kind?: VideoKind;
  duration?: TextValue;
  /** the downloadable original, once uploaded */
  src?: string;
  media: MediaRef;
};

export type SpeechItem = {
  id: string;
  title: TextValue;
  stageId?: string;
  year?: number;
  duration: TextValue;
  excerpt: TextValue;
  media: MediaRef;
};

export type Article = {
  id: string;
  title: TextValue;
  excerpt: TextValue;
  date: TextValue;
  source: TextValue;
  author: TextValue;
  readingTime: TextValue;
  media: MediaRef;
};

export type LibraryCategory = "works" | "about";

export type LibraryItem = {
  id: string;
  category: LibraryCategory;
  title: TextValue;
  author: TextValue;
  year: TextValue;
  publisher: TextValue;
  pages: TextValue;
  summary: TextValue;
  /** the cover */
  media: MediaRef;
  fileUrl?: string;
};

export type GallerySpan = 3 | 4 | 5 | 6 | 7 | 8;

export type GalleryItem = {
  id: string;
  caption: TextValue;
  stageId?: string;
  year?: number;
  /** width / height */
  ratio: number;
  /** column span on the 12-col desktop grid */
  span: GallerySpan;
  media: MediaRef;
};

export type HeroSlide = {
  id: string;
  quote: TextValue;
  source: TextValue;
  date: TextValue;
  image?: ImageAsset;
  media: MediaRef;
};

export type HomeVideo = {
  id: string;
  kind?: VideoKind;
  title: TextValue;
  duration: TextValue;
  year: TextValue;
  media: MediaRef;
};

export type LifeEvent = { date: string; year?: number; place: string };

export type Person = {
  name: string;
  storyTitle: string;
  birth: LifeEvent;
  death: LifeEvent;
  father?: string;
  family?: string;
  spouse?: string;
  children?: string;
  portrait: ImageAsset;
  quote: TextValue;
};

export type SocialId = "facebook" | "instagram" | "x" | "youtube" | "telegram" | "whatsapp";
export type Social = { id: SocialId; label: string; href: string };

export type SiteSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  socials: Social[];
};

export type About = { title: string; name: string; paragraphs: string[] };

export type PageIntros = { eye: TextValue; library: TextValue };

export type HomeContent = {
  slides: HeroSlide[];
  speeches: SpeechItem[];
  photos: ArchiveItem[];
  videos: HomeVideo[];
  articles: Article[];
  books: LibraryItem[];
  about: About;
};

/** Content every page needs: loaded once in the layout and shared through context. */
export type SiteContent = {
  person: Person;
  settings: SiteSettings;
  stages: Stage[];
};

export type SearchEntry = {
  id: string;
  title: string;
  kind: string;
  href: string;
  body?: string;
};

export type SearchHit = SearchEntry & { snippet?: string };
