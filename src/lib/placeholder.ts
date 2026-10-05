/**
 * Slots and media references.
 *
 * A `TextSlot` is a labelled gap: the CMS field is still empty, and the site
 * shows the label instead of copy. A `MediaRef` always carries a label too,
 * and once the asset exists it also carries the asset itself.
 */
export type TextSlot = { kind: "slot"; label: string };

/** Real copy, or the slot that stands in for it. */
export type TextValue = string | TextSlot;

export const slot = (label: string): TextSlot => ({ kind: "slot", label });

export function isSlot(value: unknown): value is TextSlot {
  return typeof value === "object" && value !== null && (value as TextSlot).kind === "slot";
}

/** `value` when it has content, otherwise a slot labelled `label`. */
export const textOr = (value: string | null | undefined, label: string): TextValue =>
  value && value.trim() ? value : slot(label);

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position, from the focal point set in the admin */
  focus?: string;
};

export type VideoSource =
  | { type: "file"; src: string; mimeType: string }
  | { type: "embed"; provider: "youtube" | "vimeo" | "facebook"; embedUrl: string };

export type FileAsset = { url: string; filename: string; mimeType?: string; size?: number };

export type MediaKind = "image" | "video" | "audio" | "document";

export type MediaRef = {
  kind: MediaKind;
  /** what belongs here — the caption once real, the placeholder label until then */
  label: string;
  /** width / height */
  ratio?: number;
  /** the picture shown in the frame: the photograph, the video poster, the document cover */
  image?: ImageAsset;
  /** playable source, for videos */
  video?: VideoSource;
  /** the original file, offered for download */
  file?: FileAsset;
};

export const media = (kind: MediaKind, label: string, ratio?: number): MediaRef => ({ kind, label, ratio });
