"use client";

import { forwardRef, memo } from "react";
import type { IntroStep } from "@/data/intro";
import { person, stageById, type Stage } from "@/data/person";
import { brand, ui } from "@/data/site";
import { cn } from "@/lib/utils";
import { Logo, Wordmark } from "@/components/ui/Brand";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { Portrait } from "@/components/ui/Portrait";
import { Ornament } from "@/components/ui/Ornament";
import { ArrowIcon } from "@/components/ui/Icons";
import { Meta } from "@/components/ui/Meta";
import { ChatPanel } from "@/components/chat/ChatPanel";

type Props = {
  step: IntroStep;
  index: number;
  goTo: (index: number) => void;
  onClose: () => void;
};

/* the slide's own padding reserves the bottom bar, so content centres above it */
const base =
  "invisible absolute inset-0 overflow-y-auto overscroll-contain pb-[var(--intro-bar,9rem)] md:overflow-hidden";

const chapterLabel = (stage: Stage) => `الفصل ${String(stage.index).padStart(2, "0")}`;

function ChapterText({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <div className={className}>
      <div data-anim>
        <Meta items={[chapterLabel(stage), stage.period]} />
      </div>
      <h2 data-title className="text-display mt-5 text-[clamp(1.9rem,4.4vw,4rem)] text-cream opacity-0 text-balance">
        {stage.title}
      </h2>
      <p data-anim className="mt-6 max-w-xl whitespace-pre-line text-[0.95rem] leading-[1.9] text-cream/85 md:text-[1.02rem]">
        {stage.body}
      </p>
    </div>
  );
}

function ChapterYear({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <span data-anim className={cn("text-display block leading-none text-cream/10 tabular-nums", className)} aria-hidden="true">
      {stage.yearFrom}
    </span>
  );
}

/** One full-screen step of the first-visit story. Animation hooks: data-media / data-anim / data-title / data-late. */
export const IntroSlide = memo(
  forwardRef<HTMLDivElement, Props>(function IntroSlide({ step, index, goTo, onClose }, ref) {
    const onNext = () => goTo(index + 1);

    if (step.kind === "title") {
      return (
        <div ref={ref} className={cn(base, "flex")}>
          <div className="px-gutter m-auto flex max-w-4xl flex-col items-center pt-28 text-center short:pt-20 shorter:pt-16">
            <div data-anim>
              <Logo height={88} className="text-gold short:h-14 shorter:hidden" />
            </div>
            <div data-anim className="mt-8 text-cream short:mt-5">
              <Wordmark height={40} />
            </div>
            <p data-anim className="eyebrow tracking-sep mt-4 shorter:hidden">
              {brand.tagline}
            </p>
            <h1 data-title className="text-display mt-10 text-[clamp(2.2rem,6.5vw,6rem)] text-cream opacity-0 short:mt-6 short:text-[clamp(1.7rem,4vw,3rem)]">
              {person.storyTitle}
            </h1>
            <p data-anim className="text-heading mt-5 text-[clamp(1.1rem,2.4vw,1.7rem)] text-gold tabular-nums">
              {person.birth.year} — {person.death.year}
            </p>
            <div data-anim className="mt-12 flex flex-wrap items-center justify-center gap-4 short:mt-8">
              <button
                type="button"
                onClick={onNext}
                className="group inline-flex h-13 items-center gap-3 border border-gold px-8 text-[0.85rem] font-medium tracking-[0.1em] text-gold transition-colors hover:bg-gold hover:text-night"
              >
                {ui.begin}
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </button>
              <button type="button" onClick={onClose} className="h-13 px-4 text-[0.78rem] tracking-[0.1em] text-cream/60 transition-colors hover:text-cream">
                {ui.skip}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step.kind === "closing") {
      return (
        <div ref={ref} className={cn(base, "flex")}>
          <div className="px-gutter mx-auto grid w-full max-w-7xl gap-10 pt-28 md:grid-cols-12 md:items-center md:gap-8">
            <div className="md:col-span-5">
              <div data-anim>
                <Ornament unit="star" className="w-12 text-gold" />
              </div>
              <h2 data-title className="text-heading mt-8 text-[clamp(1.9rem,4.2vw,3.6rem)] text-cream opacity-0 text-balance">
                {ui.chatPrompt}
              </h2>
              <span data-anim className="rule-gold mt-6" aria-hidden="true" />
              <p data-anim className="mt-6 max-w-md text-[0.92rem] leading-[1.9] text-blue-32">
                اسأل عن أي مرحلة أو لحظة، وستكون الإجابة مقطعًا من الأرشيف.
              </p>
            </div>
            <div data-late className="md:col-span-7">
              <div className="flex h-[58vh] flex-col border border-cream/10 bg-blue-dark/80 md:h-[68vh]">
                <ChatPanel embedded onNavigate={onClose} className="px-4 md:px-6" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    const stage = stageById(step.stageId)!;
    // the story shows photographs only; clips and documents live in the archive
    const images = stage.media.filter((m) => m.kind === "image");
    const primary = images[0] ?? stage.media[0];
    const secondary = images[1];
    const isDeath = step.stageId === "death";

    if (step.layout === "full") {
      return (
        <div ref={ref} className={base}>
          <div data-media className="absolute inset-0">
            <div data-media-inner className="absolute inset-0">
              <MediaFrame media={primary} fill tone="blue" unitSize="lg" />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-night via-night/60 to-night/10" />
          </div>
          <div className="px-gutter relative flex min-h-full flex-col justify-end pt-28">
            <ChapterYear stage={stage} className="mb-6 text-[clamp(4rem,14vw,12rem)] text-gold/25" />
            <ChapterText stage={stage} className="max-w-3xl" />
          </div>
        </div>
      );
    }

    if (step.layout === "video") {
      return (
        <div ref={ref} className={base}>
          <div className="px-gutter mx-auto flex min-h-full max-w-6xl flex-col justify-center pt-28">
            <div data-media className="relative">
              <div data-media-inner>
                <MediaFrame media={primary} ratio={16 / 9} tone="blue" unitSize="lg" className="max-h-[46vh] w-full" />
              </div>
              <ChapterYear stage={stage} className="absolute -top-8 end-4 text-[clamp(3rem,9vw,8rem)] text-gold/30 md:-top-14" />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <div data-anim>
                  <Meta items={[chapterLabel(stage), stage.period]} />
                </div>
                <h2 data-title className="text-display mt-4 text-[clamp(1.7rem,3.6vw,3.2rem)] text-cream opacity-0 text-balance">
                  {stage.title}
                </h2>
              </div>
              <p data-anim className="whitespace-pre-line text-[0.95rem] leading-[1.9] text-cream/85 md:col-span-7 md:text-[1rem]">
                {stage.body}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (step.layout === "quote") {
      return (
        <div ref={ref} className={base}>
          <div className="px-gutter mx-auto flex min-h-full max-w-5xl flex-col justify-center pt-28">
            <div data-anim>
              <Meta items={[chapterLabel(stage), stage.period]} />
            </div>
            <blockquote className="mt-8">
              <span data-anim className="text-display block text-[6rem] leading-[0.6] text-gold" aria-hidden="true">
                «
              </span>
              <p data-title className="text-heading mt-4 text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.45] text-cream opacity-0">
                <Slot value={step.quote ?? stage.caption} />
              </p>
              <footer data-anim className="mt-8 flex flex-wrap items-center gap-4 text-[0.78rem] tracking-[0.08em] text-blue-32">
                <span className="rule-gold w-10" aria-hidden="true" />
                <span>{stage.title}</span>
              </footer>
            </blockquote>
            <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
              <p data-anim className="whitespace-pre-line text-[0.92rem] leading-[1.9] text-cream/80 md:col-span-8">
                {stage.body}
              </p>
              <div data-media className="md:col-span-3 md:col-start-10">
                <div data-media-inner>
                  <MediaFrame media={primary} ratio={4 / 5} tone="blue" unitSize="sm" className="w-40 md:w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step.layout === "split") {
      return (
        <div ref={ref} className={base}>
          <div className="px-gutter mx-auto grid min-h-full max-w-7xl items-center gap-10 pt-28 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6">
              <ChapterYear stage={stage} className="mb-4 text-[clamp(3rem,8vw,7rem)]" />
              <ChapterText stage={stage} />
            </div>
            <div className="relative h-[42vh] md:col-span-6 md:h-[70vh]">
              <div data-media className="absolute inset-y-0 end-0 w-[62%]">
                <div data-media-inner className="h-full">
                  <MediaFrame media={primary} fill tone="blue" unitSize="md" />
                </div>
              </div>
              {secondary && (
                <div data-media className="absolute bottom-[8%] start-0 w-[58%]">
                  <div data-media-inner>
                    <MediaFrame media={secondary} ratio={4 / 3} tone="dark" unitSize="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    /* portrait (default) */
    return (
      <div ref={ref} className={base}>
        <div className="px-gutter mx-auto grid min-h-full max-w-7xl items-center gap-10 pt-28 md:grid-cols-12 md:gap-8">
          <div className="order-2 md:order-1 md:col-span-6">
            <ChapterYear stage={stage} className="mb-4 text-[clamp(3rem,8vw,7rem)]" />
            <ChapterText stage={stage} />
          </div>
          <div className="order-1 md:order-2 md:col-span-5 md:col-start-8">
            <div data-media className="relative ms-auto h-[40vh] w-[78%] md:h-[70vh] md:w-full">
              <div data-media-inner className="absolute inset-0">
                {isDeath ? (
                  <Portrait variant="duotone" className="h-full w-full" sizes="(min-width: 768px) 38vw, 78vw" />
                ) : (
                  <MediaFrame media={primary} fill tone="blue" unitSize="lg" />
                )}
              </div>
              <span className="pointer-events-none absolute -bottom-3 -start-3 h-full w-full border border-gold/40" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    );
  }),
);
