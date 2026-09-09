import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";
import { stages } from "./person";

/** «خطابات» — الخطابات وحدها. كل العناصر خانات بديلة. */
export type SpeechItem = {
  id: string;
  title: TextSlot;
  stageId: string;
  year?: number;
  duration: TextSlot;
  excerpt: TextSlot;
  media: MediaPlaceholder;
};

export const speechItems: SpeechItem[] = Array.from({ length: 10 }, (_, i) => {
  const stage = stages[(i + 4) % stages.length];
  return {
    id: `speech-${i + 1}`,
    title: slot("عنوان الخطاب"),
    stageId: stage.id,
    year: stage.yearFrom,
    duration: slot("المدة"),
    excerpt: slot("مقتطف"),
    media: media("video", `خطاب — ${stage.title}`, 16 / 9),
  };
});
