import type * as CMS from "@/payload-types";
import { parseVideoLink } from "@/lib/video";
import { media, slot, textOr, type FileAsset, type ImageAsset, type MediaRef } from "@/lib/placeholder";
import { formatDate, lexicalText, readingTime } from "./format";
import type {
  About,
  Article,
  ArchiveItem,
  ArchiveSize,
  GalleryItem,
  GallerySpan,
  HeroSlide,
  HomeVideo,
  LibraryItem,
  Moment,
  PageIntros,
  Person,
  SiteSettings,
  Social,
  SocialId,
  SpeechItem,
  Stage,
} from "./types";

/**
 * CMS document → site shape. Every empty field becomes a slot, every missing
 * asset a labelled placeholder, so the design holds while content arrives.
 */

type Rel<T> = number | T | null | undefined;
type VideoGroup = CMS.Speech["video"];

/** A populated relationship, or nothing if it was left unset or not populated. */
const doc = <T extends object>(value: Rel<T>): T | undefined =>
  value && typeof value === "object" ? value : undefined;

/**
 * Upload URLs as site-relative paths. Payload prefixes them with the server
 * URL when one is configured; files are always served from this origin.
 */
function sitePath(url: string): string {
  if (url.startsWith("/")) return url;
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

const optional = (value: string | null | undefined) => (value && value.trim() ? value : undefined);
const optionalNumber = (value: number | null | undefined) => (typeof value === "number" ? value : undefined);

export function imageAsset(value: Rel<CMS.Media>, fallbackAlt = ""): ImageAsset | undefined {
  const image = doc(value);
  if (!image?.url || !image.width || !image.height) return undefined;
  const hasFocus = typeof image.focalX === "number" && typeof image.focalY === "number";
  return {
    src: sitePath(image.url),
    width: image.width,
    height: image.height,
    alt: image.alt || fallbackAlt,
    focus: hasFocus ? `${image.focalX}% ${image.focalY}%` : undefined,
  };
}

function fileAsset(value: Rel<CMS.Document | CMS.Video | CMS.Media>): FileAsset | undefined {
  const file = doc(value);
  if (!file?.url || !file.filename) return undefined;
  return {
    url: sitePath(file.url),
    filename: file.filename,
    mimeType: optional(file.mimeType),
    size: optionalNumber(file.filesize),
  };
}

const ratioOf = (image: ImageAsset | undefined) => (image ? image.width / image.height : undefined);

/** A photograph; the placeholder keeps `label` and `ratio` until the upload exists. */
function imageMedia(value: Rel<CMS.Media>, label: string, ratio?: number): MediaRef {
  const image = imageAsset(value, label);
  return {
    ...media("image", image?.alt || label, ratio ?? ratioOf(image)),
    image,
    file: image ? fileAsset(value) : undefined,
  };
}

/** A video from either source. Links that do not parse leave the placeholder in place. */
export function videoMedia(group: VideoGroup | null | undefined, label: string, ratio = 16 / 9): MediaRef {
  const base = media("video", label, ratio);
  if (!group) return base;
  const poster = imageAsset(group.poster, label);

  if (group.source === "upload") {
    const file = doc(group.file);
    if (!file?.url) return { ...base, image: poster };
    return {
      ...base,
      image: poster ?? imageAsset(file.poster, label),
      video: { type: "file", src: sitePath(file.url), mimeType: file.mimeType || "video/mp4" },
      file: fileAsset(file),
    };
  }

  const link = parseVideoLink(group.url);
  if (!link) return { ...base, image: poster };
  if (link.type === "file") return { ...base, image: poster, video: link };
  return {
    ...base,
    video: { type: "embed", provider: link.provider, embedUrl: link.embedUrl },
    image: poster ?? (link.thumbnail ? { src: link.thumbnail, width: 480, height: 360, alt: label } : undefined),
  };
}

function documentMedia(file: Rel<CMS.Document>, cover: Rel<CMS.Media>, label: string, ratio = 3 / 4): MediaRef {
  return {
    ...media("document", doc(file)?.title || label, ratio),
    image: imageAsset(cover, label),
    file: fileAsset(file),
  };
}

const stageSlug = (value: Rel<CMS.Stage>) => doc(value)?.slug;

/* ------------------------------------------------------------------ stages */

export function toStage(stage: CMS.Stage, position: number): Stage {
  const rows = (stage.media ?? []).map((row): MediaRef => {
    const label = optional(row.label);
    if (row.kind === "video") return videoMedia(row.video, label ?? `مقطع — ${stage.title}`);
    if (row.kind === "document") return documentMedia(row.document, undefined, label ?? `وثيقة — ${stage.title}`);
    const image = imageMedia(row.image, label ?? `صورة أرشيفية — ${stage.title}`, undefined);
    return label ? { ...image, label } : image;
  });

  return {
    id: stage.slug,
    index: position + 1,
    period: optional(stage.period),
    yearFrom: optionalNumber(stage.yearFrom),
    yearTo: optionalNumber(stage.yearTo),
    title: stage.title,
    body: stage.body,
    longBody: textOr(stage.longBody, "النص الكامل للمرحلة"),
    media: rows.length ? rows : [media("image", `صورة أرشيفية — ${stage.title}`, 4 / 5)],
    caption: textOr(stage.caption, "تعليق الصورة"),
  };
}

export const toMoment = (moment: CMS.Moment): Moment => ({
  year: moment.year,
  label: moment.label,
  date: optional(moment.date),
  stageId: stageSlug(moment.stage),
});

/* ----------------------------------------------------------------- archive */

const PHOTO_ROTATION: ArchiveSize[] = ["lg", "sm", "md", "sm"];

function archiveSize(chosen: string | null | undefined, ratio: number | undefined, position: number): ArchiveSize {
  if (chosen && chosen !== "auto") return chosen as ArchiveSize;
  if (ratio !== undefined && ratio >= 1.5) return "wide";
  if (ratio !== undefined && ratio <= 0.8) return "tall";
  return PHOTO_ROTATION[position % PHOTO_ROTATION.length];
}

export function toArchiveItem(item: CMS.ArchiveItem, position: number): ArchiveItem {
  const base = {
    id: `archive-${item.id}`,
    title: textOr(item.title, "عنوان المادّة"),
    stageId: stageSlug(item.stage),
    year: optionalNumber(item.year) ?? optionalNumber(doc(item.stage)?.yearFrom),
  };

  if (item.type === "video") {
    const mediaRef = videoMedia(item.video, item.title);
    return {
      ...base,
      type: "video",
      kind: item.kind ?? undefined,
      duration: textOr(item.duration, "المدة"),
      size: item.size && item.size !== "auto" ? item.size : "wide",
      src: mediaRef.file?.url,
      media: mediaRef,
    };
  }

  if (item.type === "text") {
    const mediaRef = documentMedia(item.document, item.image, item.title);
    return {
      ...base,
      type: "text",
      size: item.size && item.size !== "auto" ? item.size : position % 3 === 0 ? "md" : "tall",
      src: mediaRef.file?.url,
      media: mediaRef,
    };
  }

  const mediaRef = imageMedia(item.image, item.title);
  return {
    ...base,
    type: "photo",
    size: archiveSize(item.size, mediaRef.ratio, position),
    src: mediaRef.file?.url,
    media: mediaRef,
  };
}

export function toSpeech(speech: CMS.Speech): SpeechItem {
  return {
    id: `speech-${speech.id}`,
    title: textOr(speech.title, "عنوان الخطاب"),
    stageId: stageSlug(speech.stage),
    year: optionalNumber(speech.year) ?? optionalNumber(doc(speech.stage)?.yearFrom),
    duration: textOr(speech.duration, "المدة"),
    excerpt: textOr(speech.excerpt, "مقتطف"),
    media: videoMedia(speech.video, `خطاب — ${speech.title}`),
  };
}

/** Speeches join the archive grid as their own type. */
export const speechAsArchiveItem = (speech: SpeechItem): ArchiveItem => ({
  id: speech.id,
  type: "speech",
  title: speech.title,
  stageId: speech.stageId,
  year: speech.year,
  size: "wide",
  duration: speech.duration,
  src: speech.media.file?.url,
  media: speech.media,
});

export function toHomeVideo(item: ArchiveItem): HomeVideo {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    duration: item.duration ?? slot("المدة"),
    year: item.year !== undefined ? String(item.year) : slot("السنة"),
    media: item.media,
  };
}

/* ---------------------------------------------------------------- articles */

export function toArticle(article: CMS.Article): Article {
  const text = lexicalText(article.body);
  return {
    id: String(article.id),
    title: textOr(article.title, "عنوان المقال"),
    excerpt: textOr(article.excerpt, "وصف مختصر"),
    date: textOr(formatDate(article.publishedAt), "التاريخ"),
    source: textOr(article.source, "المصدر"),
    author: textOr(article.author, "الكاتب"),
    readingTime: textOr(optional(article.readingTime) ?? readingTime(text), "مدة القراءة"),
    media: imageMedia(article.cover, `صورة المقال — ${article.title}`, 4 / 3),
  };
}

/* ------------------------------------------------------------------- books */

export function toBook(book: CMS.Book): LibraryItem {
  const cover = imageMedia(book.cover, `غلاف — ${book.title}`, 3 / 4);
  return {
    id: `book-${book.id}`,
    category: book.category,
    title: textOr(book.title, "عنوان المؤلَّف"),
    author: textOr(book.author, "المؤلِّف"),
    year: textOr(book.year, "سنة النشر"),
    publisher: textOr(book.publisher, "الناشر"),
    pages: typeof book.pages === "number" ? String(book.pages) : slot("عدد الصفحات"),
    summary: textOr(book.summary, "نبذة"),
    media: { ...cover, kind: cover.image ? "image" : "document" },
    fileUrl: fileAsset(book.file)?.url,
  };
}

/* ----------------------------------------------------------------- gallery */

/** The asymmetric grid rhythm; each picture keeps its own proportions within it. */
const GALLERY_LAYOUT: Array<[number, GallerySpan]> = [
  [4 / 5, 5],
  [3 / 2, 7],
  [1, 4],
  [16 / 9, 8],
  [4 / 5, 4],
  [3 / 4, 4],
  [3 / 2, 8],
  [1, 4],
  [4 / 5, 5],
  [16 / 9, 7],
  [3 / 4, 3],
  [3 / 2, 6],
  [1, 3],
  [4 / 5, 6],
  [16 / 9, 6],
];

export function toGalleryItem(item: CMS.Gallery, position: number): GalleryItem {
  const [fallbackRatio, span] = GALLERY_LAYOUT[position % GALLERY_LAYOUT.length];
  const caption = optional(item.caption);
  const mediaRef = imageMedia(item.image, caption ?? "صورة من المعرض");
  const ratio = mediaRef.ratio ?? fallbackRatio;
  return {
    id: `gal-${item.id}`,
    caption: textOr(caption, "تعليق الصورة"),
    stageId: stageSlug(item.stage),
    year: optionalNumber(item.year) ?? optionalNumber(doc(item.stage)?.yearFrom),
    ratio,
    span,
    media: { ...mediaRef, ratio },
  };
}

/* ------------------------------------------------------------------- home */

export function toHeroSlide(slide: CMS.HeroSlide): HeroSlide {
  const label = optional(slide.source) ? `صورة أرشيفية — ${slide.source}` : "صورة أرشيفية";
  return {
    id: `slide-${slide.id}`,
    quote: textOr(slide.quote, "اقتباس"),
    source: textOr(slide.source, "المصدر"),
    date: textOr(slide.date, "التاريخ"),
    image: imageAsset(slide.image, label),
    media: media("image", label, 16 / 9),
  };
}

export function toAbout(about: CMS.About): About {
  return {
    title: about.title || "من نحن",
    name: about.name || "",
    paragraphs: (about.paragraphs ?? []).map((p) => p.text).filter((text) => text.trim()),
  };
}

/* ---------------------------------------------------------------- globals */

/** Used until a portrait is uploaded in the admin. */
const DEFAULT_PORTRAIT: ImageAsset = { src: "/images/character.jpg", width: 736, height: 1308, alt: "" };

const lifeEvent = (event: CMS.Person["birth"] | undefined) => ({
  date: event?.date ?? "",
  year: optionalNumber(event?.year),
  place: event?.place ?? "",
});

export function toPerson(person: CMS.Person): Person {
  const name = person.name ?? "";
  return {
    name,
    storyTitle: person.storyTitle ?? "",
    birth: lifeEvent(person.birth),
    death: lifeEvent(person.death),
    father: optional(person.father),
    family: optional(person.family),
    spouse: optional(person.spouse),
    children: optional(person.children),
    portrait: imageAsset(person.portrait, `صورة ${name}`) ?? { ...DEFAULT_PORTRAIT, alt: `صورة ${name}` },
    quote: textOr(person.quote, "اقتباس رئيسي"),
  };
}

const SOCIALS: Array<{ id: SocialId; label: string }> = [
  { id: "facebook", label: "فيسبوك" },
  { id: "instagram", label: "إنستغرام" },
  { id: "x", label: "إكس" },
  { id: "youtube", label: "يوتيوب" },
  { id: "telegram", label: "تلغرام" },
  { id: "whatsapp", label: "واتساب" },
];

export function toSiteSettings(settings: CMS.SiteSetting): SiteSettings {
  return {
    email: settings.email ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    socials: SOCIALS.map(
      ({ id, label }): Social => ({ id, label, href: optional(settings.socials?.[id]) ?? "" }),
    ),
  };
}

export const toPageIntros = (intros: CMS.PageIntro): PageIntros => ({
  eye: textOr(intros.eye, "نصّ تعريفي بقسم عين"),
  library: textOr(intros.library, "نصّ تعريفي بدار النشر"),
});
