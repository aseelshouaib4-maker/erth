import { slot, type TextSlot } from "@/lib/placeholder";

/**
 * First-visit story sequence. Chapters reference biography stages by id
 * so the text is always the client-provided text.
 */
export type IntroStep =
  | { kind: "title" }
  | {
      kind: "chapter";
      stageId: string;
      /** composition preset */
      layout: "portrait" | "full" | "split" | "quote" | "video";
      quote?: TextSlot;
    }
  | { kind: "closing" };

export const introSteps: IntroStep[] = [
  { kind: "title" },
  { kind: "chapter", stageId: "birth", layout: "portrait" },
  { kind: "chapter", stageId: "najaf", layout: "split" },
  { kind: "chapter", stageId: "founding", layout: "full" },
  { kind: "chapter", stageId: "secretary-general", layout: "video" },
  { kind: "chapter", stageId: "confrontations", layout: "quote", quote: slot("اقتباس من هذه المرحلة") },
  { kind: "chapter", stageId: "death", layout: "portrait" },
  { kind: "closing" },
];
