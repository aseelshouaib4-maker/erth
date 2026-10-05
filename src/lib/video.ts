/**
 * Video links pasted in the admin panel. The admin validates with this module
 * and the site plays with it, so a link that saves is a link that plays.
 */

export type VideoProvider = "youtube" | "vimeo" | "facebook";

export type ParsedVideoLink =
  | { type: "embed"; provider: VideoProvider; embedUrl: string; thumbnail?: string }
  | { type: "file"; src: string; mimeType: string };

const FILE_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  ogg: "video/ogg",
};

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

function toUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/** `1m30s`, `90s` or `90` → seconds. */
function parseStart(value: string | null): number | undefined {
  if (!value) return undefined;
  if (/^\d+$/.test(value)) return Number(value);
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
  if (!match || !match[0]) return undefined;
  const [, h = "0", m = "0", s = "0"] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  if (host === "youtu.be") return url.pathname.split("/")[1] ?? null;
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  const [, section, id] = url.pathname.split("/");
  return ["embed", "shorts", "live", "v"].includes(section ?? "") ? (id ?? null) : null;
}

function parseYouTube(url: URL): ParsedVideoLink | null {
  const id = youtubeId(url);
  if (!id || !YOUTUBE_ID.test(id)) return null;
  const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  embed.searchParams.set("rel", "0");
  const start = parseStart(url.searchParams.get("t") ?? url.searchParams.get("start"));
  if (start) embed.searchParams.set("start", String(start));
  return {
    type: "embed",
    provider: "youtube",
    embedUrl: embed.toString(),
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

function parseVimeo(url: URL): ParsedVideoLink | null {
  const host = url.hostname.replace(/^www\./, "");
  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;
  let hash: string | undefined;
  if (host === "vimeo.com") {
    [id, hash] = parts;
  } else if (host === "player.vimeo.com" && parts[0] === "video") {
    id = parts[1];
    hash = url.searchParams.get("h") ?? undefined;
  }
  if (!id || !/^\d+$/.test(id)) return null;
  const embed = new URL(`https://player.vimeo.com/video/${id}`);
  if (hash && /^[a-f0-9]+$/i.test(hash)) embed.searchParams.set("h", hash);
  return { type: "embed", provider: "vimeo", embedUrl: embed.toString() };
}

function parseFacebook(url: URL): ParsedVideoLink | null {
  const host = url.hostname.replace(/^(www|m|web)\./, "");
  const isVideo =
    host === "fb.watch" ||
    (host === "facebook.com" && (/\/videos?\//.test(url.pathname) || url.pathname.startsWith("/watch") || url.pathname.startsWith("/reel")));
  if (!isVideo) return null;
  const embed = new URL("https://www.facebook.com/plugins/video.php");
  embed.searchParams.set("href", url.toString());
  embed.searchParams.set("show_text", "false");
  return { type: "embed", provider: "facebook", embedUrl: embed.toString() };
}

function parseFile(url: URL): ParsedVideoLink | null {
  const extension = url.pathname.split(".").pop()?.toLowerCase();
  const mimeType = extension ? FILE_TYPES[extension] : undefined;
  return mimeType ? { type: "file", src: url.toString(), mimeType } : null;
}

export function parseVideoLink(raw: string | null | undefined): ParsedVideoLink | null {
  if (!raw) return null;
  const url = toUrl(raw);
  if (!url) return null;
  return parseYouTube(url) ?? parseVimeo(url) ?? parseFacebook(url) ?? parseFile(url);
}

export const SUPPORTED_VIDEO_LINKS = "YouTube · Vimeo · Facebook · رابط مباشر لملف MP4 أو WebM";
