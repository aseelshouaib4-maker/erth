/**
 * Placeholder helpers.
 *
 * Every string produced here is a *slot label*, not content. When the real
 * text arrives (from the client or a CMS) replace the slot with the copy.
 */
export type TextSlot = { kind: "slot"; label: string };

export const slot = (label: string): TextSlot => ({ kind: "slot", label });

export function isSlot(value: unknown): value is TextSlot {
  return typeof value === "object" && value !== null && (value as TextSlot).kind === "slot";
}

/** Media placeholders carry a label describing what should go there. */
export type MediaPlaceholder = {
  kind: "image" | "video" | "audio" | "document";
  label: string;
  /** width / height */
  ratio?: number;
};

export const media = (kind: MediaPlaceholder["kind"], label: string, ratio?: number): MediaPlaceholder => ({
  kind,
  label,
  ratio,
});
