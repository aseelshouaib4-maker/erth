"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { heroSlides, SLIDE_DURATION } from "@/data/quotes";
import { person } from "@/data/person";
import { ui } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { useUI } from "@/components/layout/Providers";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { ArrowBackIcon, ArrowIcon } from "@/components/ui/Icons";
import { StartStory } from "./StartStory";

const total = heroSlides.length;

/**
 * Editorial hero: one archival image bound to one quote.
 * Image and quote live in parallel stacks and are crossfaded by a single
 * timeline, so the words can never drift away from the picture.
 */
export function HeroSlider() {
  const { introVisible } = useUI();
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const busy = useRef(false);

  const rootRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const kenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quoteBoxRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const autoRef = useRef<gsap.core.Tween | null>(null);

  /* ---------- the quote stack is absolutely positioned, so reserve the
       height of the tallest quote at the current width ---------- */
  useLayoutEffect(() => {
    const box = quoteBoxRef.current;
    if (!box) return;
    let lastWidth = -1;
    const measure = () => {
      const heights = quoteRefs.current.map((el) => el?.offsetHeight ?? 0);
      box.style.height = `${Math.max(...heights, 0)}px`;
    };
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (width === lastWidth) return; // height writes must not re-trigger us
      lastWidth = width;
      measure();
    });
    observer.observe(box);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, []);

  /* ---------- cinematic drift on the active image ---------- */
  const panImage = useCallback((i: number) => {
    const ken = kenRefs.current[i];
    if (!ken || prefersReducedMotion()) return;
    const drift = i % 2 === 0 ? 1.6 : -1.6;
    gsap.killTweensOf(ken);
    gsap.fromTo(
      ken,
      { scale: 1.04, xPercent: -drift * 0.5, yPercent: 0.6 },
      { scale: 1.16, xPercent: drift * 0.5, yPercent: -0.6, duration: SLIDE_DURATION / 1000 + 3, ease: "none" },
    );
  }, []);

  /** autoplay advances through this ref so the two callbacks do not close over each other */
  const goRef = useRef<(next: number) => void>(() => {});

  const startAutoplay = useCallback(() => {
    autoRef.current?.kill();
    const bar = progressRef.current;
    if (!bar) return;
    gsap.set(bar, { scaleX: 0 });
    if (prefersReducedMotion()) return;
    autoRef.current = gsap.to(bar, {
      scaleX: 1,
      duration: SLIDE_DURATION / 1000,
      ease: "none",
      onComplete: () => goRef.current((indexRef.current + 1) % total),
    });
  }, []);

  const go = useCallback(
    (next: number) => {
      const current = indexRef.current;
      if (busy.current || next === current) return;
      const outImg = imageRefs.current[current];
      const inImg = imageRefs.current[next];
      const outQuote = quoteRefs.current[current];
      const inQuote = quoteRefs.current[next];
      if (!outImg || !inImg || !outQuote || !inQuote) return;

      busy.current = true;
      indexRef.current = next;
      setIndex(next);
      autoRef.current?.kill();

      const d = prefersReducedMotion() ? 0 : 1;
      panImage(next);

      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            startAutoplay();
          },
        })
        // picture and words leave together
        .to(outImg, { autoAlpha: 0, duration: 1.5 * d, ease: "power2.inOut" }, 0)
        .to(outQuote, { autoAlpha: 0, y: -14, duration: 0.65 * d, ease: "power2.in" }, 0)
        // and arrive together
        .to(inImg, { autoAlpha: 1, duration: 1.5 * d, ease: "power2.inOut" }, 0)
        .fromTo(inQuote, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1.1 * d, ease: "expo.out" }, 0.3 * d);
    },
    [panImage, startAutoplay],
  );

  useEffect(() => {
    goRef.current = go;
  }, [go]);

  /* ---------- entrance, once the intro overlay is out of the way ---------- */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || introVisible) return;
      const d = prefersReducedMotion() ? 0 : 1;

      gsap.set(imageRefs.current.filter(Boolean), { autoAlpha: 0 });
      gsap.set(quoteRefs.current.filter(Boolean), { autoAlpha: 0 });

      const tl = gsap.timeline({ onComplete: startAutoplay });
      tl.fromTo(imageRefs.current[indexRef.current], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.8 * d, ease: "power2.out" }, 0)
        .fromTo("[data-hero-anim]", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1 * d, stagger: 0.09, ease: "power3.out" }, 0.25)
        .fromTo(quoteRefs.current[indexRef.current], { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.2 * d, ease: "expo.out" }, 0.5);
      panImage(indexRef.current);
    },
    { dependencies: [introVisible], scope: rootRef },
  );

  useEffect(
    () => () => {
      autoRef.current?.kill();
    },
    [],
  );

  const hold = () => autoRef.current?.pause();
  const release = () => autoRef.current?.resume();

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden bg-blue"
      aria-roledescription="carousel"
      aria-label="اقتباسات من الأرشيف"
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
    >
      {/* archival image stack */}
      <div className="absolute inset-0" aria-hidden="true">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            className="absolute inset-0 overflow-hidden opacity-0"
          >
            <div
              ref={(el) => {
                kenRefs.current[i] = el;
              }}
              className="absolute inset-0"
            >
              {slide.image ? (
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: slide.image.focus ?? "center" }}
                />
              ) : (
                <MediaFrame media={slide.media} fill tone="blue" unitSize="lg" showLabel={false} />
              )}
            </div>
          </div>
        ))}
        {/* scrim: heaviest under the words, which sit on the start (right) side */}
        <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(2,42,54,0.94),rgba(2,42,54,0.72)_38%,rgba(2,42,54,0.28)_72%,rgba(2,42,54,0.4))]" />
        <div className="absolute inset-0 bg-linear-to-t from-night via-transparent to-night/50" />
        <OrnamentGrid scale={2} fade="edges" opacity={0.07} />
      </div>

      {/* words — everything sits in one column, so the far side stays open */}
      <div className="px-gutter relative grid min-h-[100svh] grid-cols-12 content-center gap-x-6 pb-24 pt-28 md:pb-28">
        <div className="col-span-12 md:col-span-8 lg:col-span-7">
          <p data-hero-anim className="eyebrow tracking-sep flex flex-wrap items-center gap-x-3">
            <span>{person.name}</span>
            <span className="text-cream/50" dir="ltr">
              {person.birth.year} — {person.death.year}
            </span>
          </p>

          <div ref={quoteBoxRef} className="relative mt-8 md:mt-10">
            {heroSlides.map((slide, i) => (
              <div
                key={slide.id}
                ref={(el) => {
                  quoteRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-0 opacity-0"
                aria-hidden={i !== index}
              >
                <blockquote>
                  <p className="text-heading text-balance text-[clamp(1.05rem,2vw,1.75rem)] leading-[1.75] text-cream">
                    <span className="text-gold">«</span>
                    <Slot value={slide.quote} className="text-cream" />
                    <span className="text-gold">»</span>
                  </p>
                  <footer className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] tracking-[0.1em] text-blue-32">
                    <span className="rule-gold w-10" aria-hidden="true" />
                    <span>
                      {ui.source}: <Slot value={slide.source} />
                    </span>
                    <span className="text-blue-54" aria-hidden="true">
                      ·
                    </span>
                    <span>
                      {ui.date}: <Slot value={slide.date} />
                    </span>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>

          {/* slider controls */}
          <div data-hero-anim className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
            <span className="eyebrow tabular-nums" dir="ltr" aria-live="polite">
              {String(index + 1).padStart(2, "0")}
              <span className="text-blue-54"> / {String(total).padStart(2, "0")}</span>
            </span>
            <span className="relative h-px w-24 bg-cream/20 md:w-32" aria-hidden="true">
              <span ref={progressRef} className="absolute inset-0 origin-right scale-x-0 bg-gold" />
            </span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={() => go((index - 1 + total) % total)}
                className="inline-flex h-10 w-10 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
                aria-label={ui.prev}
              >
                <ArrowBackIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go((index + 1) % total)}
                className="inline-flex h-10 w-10 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
                aria-label={ui.next}
              >
                <ArrowIcon className="h-4 w-4" />
              </button>
            </span>
          </div>

          <div data-hero-anim className="mt-10 border-t border-cream/10 pt-8">
            <StartStory />
          </div>
        </div>
      </div>
    </section>
  );
}
