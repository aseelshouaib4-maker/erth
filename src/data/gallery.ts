import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";
import { stages } from "./person";

export type GalleryItem = {
  id: string;
  caption: TextSlot;
  stageId: string;
  year?: number;
  /** width / height */
  ratio: number;
  /** column span on the 12-col desktop grid */
  span: 3 | 4 | 5 | 6 | 7 | 8;
  media: MediaPlaceholder;
};

const layout: Array<[number, GalleryItem["span"]]> = [
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

export const galleryItems: GalleryItem[] = layout.map(([ratio, span], i) => {
  const stage = stages[i % stages.length];
  return {
    id: `gal-${i + 1}`,
    caption: slot("تعليق الصورة"),
    stageId: stage.id,
    year: stage.yearFrom,
    ratio,
    span,
    media: media("image", `صورة — ${stage.title}`, ratio),
  };
});
