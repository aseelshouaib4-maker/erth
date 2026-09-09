import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";

/**
 * Hero slides — one archival image bound to one quote.
 * Only quotes supplied by the client appear here; the rest are slots.
 */
export type HeroImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** where to hold the frame while it is cropped to the hero */
  focus?: string;
};

export type HeroSlide = {
  id: string;
  quote: string | TextSlot;
  source: string | TextSlot;
  date: string | TextSlot;
  /** the real photograph, once it exists */
  image?: HeroImage;
  /** the labelled placeholder shown until then */
  media: MediaPlaceholder;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-01",
    quote:
      "احرِصوا بشدّةٍ على أن يُواصلَ أبناؤكم وبناتُكم التحصيلَ العلميَّ والدراسةَ، مهما كانت الظروفُ قاسيةً وصعبةً، وعليكم أن تتحمَّلوا مشقّةَ دراستهم وأعباءَها.",
    source: "اللقاء الطلابي الجامعي السنوي",
    date: "2016",
    media: media("image", "صورة أرشيفية — اللقاء الطلابي الجامعي السنوي 2016", 16 / 9),
  },
  {
    id: "slide-02",
    quote: slot("اقتباس"),
    source: slot("المصدر"),
    date: slot("التاريخ"),
    media: media("image", "صورة أرشيفية — المشهد الثاني", 16 / 9),
  },
  {
    id: "slide-03",
    quote: slot("اقتباس"),
    source: slot("المصدر"),
    date: slot("التاريخ"),
    media: media("image", "صورة أرشيفية — المشهد الثالث", 16 / 9),
  },
  {
    id: "slide-04",
    quote: slot("اقتباس"),
    source: slot("المصدر"),
    date: slot("التاريخ"),
    media: media("image", "صورة أرشيفية — المشهد الرابع", 16 / 9),
  },
];

/** milliseconds each slide holds before the next one crossfades in */
export const SLIDE_DURATION = 9000;
