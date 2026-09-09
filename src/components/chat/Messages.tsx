"use client";

import { useRef } from "react";
import { chatCopy, type AssistantAnswer, type ResultItem } from "@/data/chat";
import { gsap, useGSAP } from "@/lib/gsap";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { ArrowIcon } from "@/components/ui/Icons";
import { MediaFrame, ParagraphSlot, Slot } from "@/components/ui/Placeholders";
import { Ornament } from "@/components/ui/Ornament";

/** In RTL chat the visitor's own messages sit on the end side (left). */
export function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[80%] border border-gold/40 bg-gold/10 px-4 py-3 text-[0.92rem] leading-[1.8] text-cream">{text}</p>
    </div>
  );
}

export function TypingIndicator() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.to(ref.current!.querySelectorAll("span"), {
        y: -5,
        opacity: 1,
        duration: 0.45,
        stagger: { each: 0.15, repeat: -1, yoyo: true },
        ease: "sine.inOut",
      });
    },
    { scope: ref },
  );
  return (
    <div className="flex items-center gap-4">
      <div ref={ref} className="flex h-10 items-center gap-1.5 border border-cream/15 px-4" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-40" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-40" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-40" />
      </div>
      <p className="text-[0.75rem] tracking-[0.08em] text-blue-54" role="status">
        {chatCopy.typing}
      </p>
    </div>
  );
}

type AnswerProps = { answer: AssistantAnswer; onNavigate?: () => void; onAsk?: (q: string) => void };

/** The assistant answers with a video first; text is supporting. */
export function AnswerCard({ answer, onNavigate }: AnswerProps) {
  return (
    <article className="w-full max-w-full border border-cream/10 bg-blue/60">
      <header className="flex items-center justify-between gap-4 border-b border-cream/10 px-4 py-3">
        <span className="flex items-center gap-2">
          <Ornament unit="star" className="w-3.5 text-gold" />
          <span className="eyebrow">{chatCopy.videoAnswerLabel}</span>
        </span>
        <span className="text-[0.65rem] tracking-[0.1em] text-blue-54">
          <Slot value={answer.duration} /> · <Slot value={answer.source} />
        </span>
      </header>

      <MediaFrame media={answer.video} ratio={16 / 9} tone="blue" interactive className="w-full" />

      <div className="space-y-5 px-4 py-5 md:px-6">
        <h3 className="text-heading text-[1.15rem] text-cream md:text-[1.35rem]">
          <Slot value={answer.title} />
        </h3>
        <ParagraphSlot value={answer.summary} lines={3} className="text-[0.85rem]" />

        <div>
          <p className="eyebrow mb-3">{chatCopy.relatedLabel}</p>
          <div className="flex flex-wrap gap-2">
            {answer.related.map((r) => (
              <TransitionLink
                key={r.href}
                href={r.href}
                onClick={onNavigate}
                className="group inline-flex h-9 items-center gap-2 border border-gold/50 px-3 text-[0.75rem] text-gold transition-colors hover:bg-gold hover:text-night"
              >
                {r.label}
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              </TransitionLink>
            ))}
          </div>
        </div>

        {answer.results && (
          <div>
            <p className="eyebrow mb-3">{chatCopy.resultsLabel}</p>
            <div className="grid grid-cols-3 gap-3">
              {answer.results.map((r) => (
                <ResultCard key={r.id} item={r} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function ResultCard({ item, onNavigate }: { item: ResultItem; onNavigate?: () => void }) {
  return (
    <TransitionLink href={item.href} onClick={onNavigate} className="group block">
      <MediaFrame media={item.media} ratio={item.media.ratio} tone="dark" unitSize="sm" showLabel={false} interactive />
      <p className="mt-2 truncate text-[0.72rem] text-cream/85 transition-colors group-hover:text-gold">
        <Slot value={item.title} />
      </p>
      {item.meta && <p className="text-[0.62rem] tracking-[0.1em] text-blue-54">{item.meta}</p>}
    </TransitionLink>
  );
}
