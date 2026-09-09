"use client";

import { useRef } from "react";
import { stages } from "@/data/person";
import { gsap, ScrollTrigger, useGSAP, MEDIA } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";

const n = stages.length;

/** the plate beside the text is a photograph; documents and clips live in the archive */
const plateOf = (stage: (typeof stages)[number]) => stage.media.find((m) => m.kind === "image") ?? stage.media[0];

/**
 * Interactive timeline. Desktop: one pinned stage, scrubbed and snapped along a
 * horizontal spine of markers. Mobile: stacked stages with a filling side line.
 * One DOM for both, so anchors (#stage-id) always resolve.
 */
export function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const jumpRef = useRef<(i: number) => void>(() => {});

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const pin = root.querySelector<HTMLElement>("[data-pin]");
      const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel]"));
      const markers = Array.from(root.querySelectorAll<HTMLElement>("[data-marker]"));
      const progress = root.querySelector<HTMLElement>("[data-progress]");
      const sideLine = root.querySelector<HTMLElement>("[data-side-line]");
      if (!pin || !panels.length) return;

      const mm = gsap.matchMedia();

      mm.add(`${MEDIA.desktop} and ${MEDIA.motion}`, () => {
        let current = 0;
        gsap.set(panels, { autoAlpha: 0 });
        gsap.set(panels[0], { autoAlpha: 1 });
        markers[0]?.classList.add("is-active");

        const show = (idx: number, dir: 1 | -1) => {
          const prev = panels[current];
          const next = panels[idx];
          markers[current]?.classList.remove("is-active");
          markers[idx]?.classList.add("is-active");
          current = idx;
          gsap.to(prev, { autoAlpha: 0, y: -30 * dir, duration: 0.45, ease: "power2.in", overwrite: true });
          gsap.fromTo(next, { autoAlpha: 0, y: 40 * dir }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", overwrite: true, delay: 0.25 });
          gsap.fromTo(
            next.querySelectorAll("[data-panel-media]"),
            { clipPath: dir > 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0% 0)", duration: 1.1, ease: "expo.out", delay: 0.3, overwrite: true },
          );
          gsap.fromTo(next.querySelector("[data-panel-index]"), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "expo.out", delay: 0.3, overwrite: true });
        };

        const st = ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: () => `+=${(n - 1) * window.innerHeight * 0.85}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut" },
          onUpdate: (self) => {
            if (progress) gsap.set(progress, { scaleX: self.progress });
            const idx = Math.round(self.progress * (n - 1));
            if (idx !== current) show(idx, idx > current ? 1 : -1);
          },
        });

        const scrollToIndex = (i: number, smooth = true) => {
          const y = st.start + (st.end - st.start) * (i / (n - 1));
          window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
        };
        jumpRef.current = scrollToIndex;

        // deep link: /biography#stage-id
        const hash = window.location.hash.slice(1);
        const target = stages.findIndex((s) => s.id === hash);
        if (target > 0) {
          const t = window.setTimeout(() => {
            ScrollTrigger.refresh();
            scrollToIndex(target, false);
          }, 150);
          return () => window.clearTimeout(t);
        }
      });

      mm.add(`${MEDIA.mobile}, ${MEDIA.reduced}`, () => {
        jumpRef.current = (i) => document.getElementById(stages[i].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      mm.add(`${MEDIA.mobile} and ${MEDIA.motion}`, () => {
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelectorAll("[data-panel-anim]"),
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: panel, start: "top 80%", once: true } },
          );
        });
        if (sideLine) {
          gsap.fromTo(sideLine, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top 60%", end: "bottom 60%", scrub: true } });
        }
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative bg-blue">
      <div data-pin className="relative lg:h-screen lg:overflow-hidden">
        <OrnamentGrid scale={4} fade="bottom" opacity={0.08} className="hidden lg:block" />

        {/* spine — desktop */}
        <div className="absolute inset-x-[var(--gutter)] top-28 z-10 hidden lg:block">
          <div className="relative h-px bg-cream/15">
            <span data-progress className="absolute inset-0 origin-right scale-x-0 bg-gold" />
          </div>
          <ol className="mt-4 flex justify-between">
            {stages.map((stage, i) => (
              <li key={stage.id}>
                <button
                  type="button"
                  data-marker
                  onClick={() => jumpRef.current(i)}
                  className="group flex flex-col items-start gap-1 text-start text-[0.62rem] tracking-[0.1em] text-blue-54 transition-colors hover:text-cream [&.is-active]:text-gold"
                >
                  <span className="tabular-nums">{String(stage.index).padStart(2, "0")}</span>
                  <span className="hidden xl:block">{stage.yearFrom ?? "—"}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* side line — mobile */}
        <div className="absolute inset-y-0 start-[var(--gutter)] w-px bg-cream/10 lg:hidden" aria-hidden="true">
          <span data-side-line className="absolute inset-0 origin-top bg-gold" />
        </div>

        <div className="relative lg:h-full">
          {stages.map((stage) => {
            const plate = plateOf(stage);
            return (
              <article
                key={stage.id}
                id={stage.id}
                data-panel
                className={cn("px-gutter relative py-16 lg:absolute lg:inset-0 lg:flex lg:items-center lg:py-0 lg:pt-56")}
              >
                <div className="grid w-full items-start gap-12 ps-8 lg:grid-cols-12 lg:gap-x-12 lg:ps-0">
                  <div className="relative lg:col-span-6">
                    <span className="absolute top-2 -start-8 h-3 w-3 -translate-x-1/2 border border-gold bg-blue lg:hidden" aria-hidden="true" />

                    <span
                      data-panel-index
                      data-panel-anim
                      className="text-display block leading-[0.85] text-cream/10 text-[clamp(3.5rem,8vw,7rem)] tabular-nums"
                      aria-hidden="true"
                    >
                      {String(stage.index).padStart(2, "0")}
                    </span>

                    <p data-panel-anim className="eyebrow mt-4">
                      {stage.period ?? "بلا تاريخ محدد"}
                    </p>

                    <h2 data-panel-anim className="text-heading mt-6 max-w-xl text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.35] text-cream text-balance">
                      {stage.title}
                    </h2>

                    <p data-panel-anim className="mt-8 max-w-xl whitespace-pre-line text-[0.95rem] leading-[2] text-cream/85">
                      {stage.body}
                    </p>

                    <p data-panel-anim className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-cream/15 pt-6 text-[0.75rem] tracking-[0.08em] text-blue-54">
                      <span className="eyebrow">النص الكامل</span>
                      <Slot value={stage.longBody} />
                    </p>
                  </div>

                  {/* the plate: a photograph and nothing else */}
                  <div className="lg:col-span-5 lg:col-start-8">
                    <figure data-panel-media data-panel-anim className="relative">
                      <div className="relative aspect-[3/2] w-full lg:aspect-[4/3]">
                        <MediaFrame media={plate} fill tone="dark" unitSize="lg" showLabel={false} />
                      </div>
                      <span className="pointer-events-none absolute -bottom-2 -start-2 h-full w-full border border-gold/35" aria-hidden="true" />
                      <figcaption className="mt-5 flex items-center gap-3 text-[0.65rem] leading-[1.8] tracking-[0.08em] text-blue-54">
                        <span className="rule-gold w-6 shrink-0" aria-hidden="true" />
                        {plate.label}
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
