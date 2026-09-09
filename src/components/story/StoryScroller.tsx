"use client";

import { useRef, useState } from "react";
import { stages } from "@/data/person";
import { gsap, ScrollTrigger, useGSAP, MEDIA } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { Ornament } from "@/components/ui/Ornament";
import { Meta } from "@/components/ui/Meta";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * Scroll-driven story: the visual column stays pinned (sticky) while chapters
 * pass by; each chapter swaps the frame, slides it horizontally and re-scales it.
 */
export function StoryScroller() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // chapter triggers + progress line
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const chapters = root.querySelectorAll<HTMLElement>("[data-chapter]");
      const progress = root.querySelector<HTMLElement>("[data-progress]");

      chapters.forEach((chapter, i) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
      if (progress) {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: root, start: "top 55%", end: "bottom 55%", scrub: true } },
        );
      }
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        chapters.forEach((chapter) => {
          gsap.fromTo(
            chapter.querySelectorAll("[data-chapter-anim]"),
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: chapter, start: "top 75%", once: true } },
          );
        });
      });
    },
    { scope: ref },
  );

  // crossfade + horizontal move of the pinned visuals
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const frames = root.querySelectorAll<HTMLElement>("[data-frame]");
      const year = root.querySelector<HTMLElement>("[data-year]");
      const d = prefersReducedMotion() ? 0 : 1;
      frames.forEach((frame, i) => {
        const isActive = i === active;
        gsap.to(frame, {
          autoAlpha: isActive ? 1 : 0,
          x: isActive ? 0 : i < active ? 60 : -60,
          scale: isActive ? 1 : 1.06,
          duration: 1 * d,
          ease: "power3.out",
          overwrite: true,
        });
      });
      if (year) gsap.fromTo(year, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8 * d, ease: "expo.out", overwrite: true });
    },
    { dependencies: [active], scope: ref },
  );

  const current = stages[active];

  return (
    <section ref={ref} className="relative bg-blue">
      <div className="px-gutter grid gap-0 lg:grid-cols-12 lg:gap-8">
        {/* pinned visual — desktop */}
        <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
          <div className="sticky top-0 flex h-screen items-center py-24">
            <div className="relative h-[68vh] w-full">
              {stages.map((stage, i) => (
                <div key={stage.id} data-frame className={cn("absolute inset-0", i !== 0 && "invisible opacity-0")}>
                  <MediaFrame media={stage.media[0]} fill tone="dark" unitSize="lg" />
                </div>
              ))}
              <span className="pointer-events-none absolute -bottom-3 -start-3 h-full w-full border border-gold/40" aria-hidden="true" />
              <span data-year className="text-display absolute -top-10 end-0 leading-none text-gold/40 text-[7rem] tabular-nums" aria-hidden="true">
                {current.yearFrom ?? ""}
              </span>
              <p className="absolute -bottom-10 start-0 text-[0.65rem] tracking-[0.1em] text-blue-54">
                الفصل {String(current.index).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* chapters */}
        <div className="relative lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <div className="absolute inset-y-0 -start-4 hidden w-px bg-cream/10 lg:block" aria-hidden="true">
            <span data-progress className="absolute inset-0 origin-top bg-gold" />
          </div>

          {stages.map((stage) => (
            <article key={stage.id} id={stage.id} data-chapter className="flex min-h-[80vh] flex-col justify-center py-16 lg:min-h-screen lg:py-24">
              <div data-chapter-anim className="mb-8 lg:hidden">
                <MediaFrame media={stage.media[0]} ratio={stage.media[0].ratio ?? 4 / 3} tone="dark" />
              </div>
              <div data-chapter-anim>
                <Meta items={[`الفصل ${String(stage.index).padStart(2, "0")}`, stage.period]} />
              </div>
              <h2 data-chapter-anim className="text-display mt-5 text-[clamp(1.9rem,4vw,3.6rem)] text-cream text-balance">
                {stage.title}
              </h2>
              <p data-chapter-anim className="mt-6 max-w-xl whitespace-pre-line text-[0.98rem] leading-[1.9] text-cream/85">
                {stage.body}
              </p>
              <p data-chapter-anim className="mt-4 text-[0.72rem] tracking-[0.08em] text-blue-54">
                <Slot value={stage.caption} />
              </p>
              {stage.media[1] && (
                <div data-chapter-anim className="mt-8 flex items-center gap-4">
                  <MediaFrame media={stage.media[1]} ratio={16 / 9} tone="night" unitSize="sm" interactive className="w-40" />
                  <p className="text-[0.7rem] tracking-[0.08em] text-blue-54">{stage.media[1].label}</p>
                </div>
              )}
              <TransitionLink
                data-chapter-anim
                href={`/biography#${stage.id}`}
                className="group mt-8 inline-flex items-center gap-3 text-[0.75rem] tracking-[0.1em] text-gold transition-colors hover:text-cream"
              >
                <Ornament unit="rose" className="w-3.5" />
                في السيرة
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </TransitionLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
