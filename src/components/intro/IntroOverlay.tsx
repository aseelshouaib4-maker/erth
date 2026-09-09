"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { introSteps } from "@/data/intro";
import { person, stageById } from "@/data/person";
import { brand, ui } from "@/data/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn, markIntroSeen, prefersReducedMotion } from "@/lib/utils";
import { useUI } from "@/components/layout/Providers";
import { emit, INTRO_CLOSED } from "@/components/layout/transitions";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { Wordmark } from "@/components/ui/Brand";
import { ArrowBackIcon, ArrowIcon, CloseIcon } from "@/components/ui/Icons";
import { IntroSlide } from "./IntroSlide";

const total = introSteps.length;
const k = () => (prefersReducedMotion() ? 0 : 1);

/* ---------- slide choreography ---------- */
function animateIn(slide: HTMLElement, dir: 1 | -1) {
  const d = k();
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const media = slide.querySelectorAll<HTMLElement>("[data-media]");
  const inner = slide.querySelectorAll<HTMLElement>("[data-media-inner]");
  const anim = slide.querySelectorAll<HTMLElement>("[data-anim]");
  const title = slide.querySelector<HTMLElement>("[data-title]");
  const late = slide.querySelectorAll<HTMLElement>("[data-late]");

  tl.set(slide, { visibility: "visible" });
  if (media.length) {
    tl.fromTo(
      media,
      { clipPath: dir > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)" },
      { clipPath: "inset(0% 0 0% 0)", duration: 1.2 * d, stagger: 0.12 },
      0,
    );
    tl.fromTo(inner, { scale: 1.12 }, { scale: 1, duration: 1.6 * d }, 0);
  }
  if (title) {
    const split = new SplitText(title, { type: "lines", mask: "lines" });
    tl.set(title, { opacity: 1 }, 0);
    tl.fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1 * d, stagger: 0.09 }, 0.25);
    tl.add(() => split.revert());
  }
  tl.fromTo(anim, { opacity: 0, y: 26 * dir }, { opacity: 1, y: 0, duration: 0.9 * d, stagger: 0.08, ease: "power3.out" }, 0.4);
  if (late.length) {
    tl.fromTo(late, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 * d, ease: "power3.out" }, 1.1);
  }
  return tl;
}

function animateOut(slide: HTMLElement, dir: 1 | -1) {
  const d = k();
  const tl = gsap.timeline({ defaults: { ease: "power2.in" } });
  tl.to(slide.querySelectorAll("[data-anim], [data-title], [data-late]"), { opacity: 0, y: -22 * dir, duration: 0.45 * d, stagger: 0.025 }, 0);
  tl.to(slide.querySelectorAll("[data-media]"), { clipPath: dir > 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)", duration: 0.55 * d, ease: "power3.in" }, 0);
  tl.set(slide, { visibility: "hidden" });
  return tl;
}

export function IntroOverlay() {
  const { hideIntro } = useUI();
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const busy = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const lastWheel = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((next: number) => {
    const current = stepRef.current;
    if (busy.current || next < 0 || next >= total || next === current) return;
    const out = slides.current[current];
    const inn = slides.current[next];
    if (!out || !inn) return;
    busy.current = true;
    const dir: 1 | -1 = next > current ? 1 : -1;
    stepRef.current = next;
    setStep(next);
    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .add(animateOut(out, dir))
      .add(animateIn(inn, dir), "-=0.1");
  }, []);

  const close = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    markIntroSeen();
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.6 * k(),
      ease: "power2.inOut",
      onComplete: () => {
        hideIntro();
        emit(INTRO_CLOSED);
      },
    });
  }, [hideIntro]);

  /* ---------- mount: first slide ---------- */
  useGSAP(
    () => {
      const first = slides.current[0];
      if (first) animateIn(first, 1);
    },
    { scope: rootRef },
  );

  /* ---------- scroll lock + input handling ---------- */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(t.tagName);
    const onClosing = () => introSteps[stepRef.current].kind === "closing";

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          goTo(stepRef.current + 1);
          break;
        case "ArrowRight":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(stepRef.current - 1);
          break;
        case "Escape":
          close();
          break;
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (onClosing()) return;
      const now = performance.now();
      if (Math.abs(e.deltaY) < 30 || now - lastWheel.current < 1100) return;
      lastWheel.current = now;
      goTo(stepRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    const onTouchStart = (e: TouchEvent) => {
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touch.current) return;
      const dx = e.changedTouches[0].clientX - touch.current.x;
      const dy = e.changedTouches[0].clientY - touch.current.y;
      touch.current = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        // RTL: swiping the finger to the left reveals the next chapter
        goTo(stepRef.current + (dx < 0 ? 1 : -1));
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo, close]);

  /* الشريط السفلي يُقاس، ويُنشر ارتفاعه كمتغيّر — فلا تنزل شريحةٌ تحته مهما قصر العرض */
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    const root = rootRef.current;
    if (!bar || !root) return;
    const publish = () => root.style.setProperty("--intro-bar", `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  const isLast = step === total - 1;
  const current = introSteps[step];
  const currentStage = current.kind === "chapter" ? stageById(current.stageId) : undefined;

  return (
    <div
      ref={rootRef}
      data-intro
      className="fixed inset-0 z-[100] overflow-hidden bg-night text-cream"
      role="dialog"
      aria-modal="true"
      aria-label={person.storyTitle}
    >
      <OrnamentGrid scale={2} fade="edges" opacity={0.08} outline="var(--color-blue-70)" />

      {/* top bar */}
      <div className="px-gutter absolute inset-x-0 top-0 z-20 flex h-[76px] items-center justify-between md:h-24">
        <div className="flex items-center gap-4 text-cream/80">
          <Wordmark height={20} />
          <span className="hidden text-[0.65rem] tracking-[0.22em] text-blue-54 md:inline">{brand.tagline}</span>
        </div>
        <p className="eyebrow flex items-center gap-4 tabular-nums" aria-live="polite">
          <span dir="ltr">
            {String(step + 1).padStart(2, "0")} <span className="text-blue-54">/ {String(total).padStart(2, "0")}</span>
          </span>
          {currentStage?.period && (
            <span dir="ltr" className="hidden border-s border-cream/20 ps-4 text-cream/70 md:inline">
              {currentStage.period}
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          {!isLast && (
            <button type="button" onClick={close} className="hidden h-10 items-center px-3 text-[0.72rem] tracking-[0.1em] text-cream/70 transition-colors hover:text-gold md:inline-flex">
              {ui.skip}
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
            aria-label={ui.close}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* slides */}
      <div className="absolute inset-0">
        {introSteps.map((s, i) => (
          <IntroSlide
            key={i}
            ref={(el) => {
              slides.current[i] = el;
            }}
            step={s}
            index={i}
            goTo={goTo}
            onClose={close}
          />
        ))}
      </div>

      {/* bottom bar */}
      <div ref={barRef} className="px-gutter absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-night via-night/85 to-transparent pb-6 pt-10 md:pb-8">
        <div className="mb-8 flex gap-1.5" aria-hidden="true">
          {introSteps.map((_, i) => (
            <span key={i} className="relative h-px flex-1 bg-cream/15">
              <span className={cn("absolute inset-0 origin-right bg-gold transition-transform duration-700 ease-out-expo", i <= step ? "scale-x-100" : "scale-x-0")} />
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="hidden text-[0.65rem] tracking-[0.1em] text-blue-54 md:block">مرّر بعجلة الفأرة أو استخدم الأسهم للتنقّل</p>
          <p className="text-[0.65rem] tracking-[0.1em] text-blue-54 md:hidden">اسحب للتنقّل</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={step === 0}
              className="inline-flex h-11 w-11 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-cream/20 disabled:hover:text-cream"
              aria-label={ui.prev}
            >
              <ArrowBackIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => (isLast ? close() : goTo(step + 1))}
              className="inline-flex h-11 items-center gap-3 border border-gold px-5 text-[0.75rem] font-medium tracking-[0.1em] text-gold transition-colors hover:bg-gold hover:text-night"
            >
              {isLast ? "ادخل إلى الموقع" : ui.next}
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
