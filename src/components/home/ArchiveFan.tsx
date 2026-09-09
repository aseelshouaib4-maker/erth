"use client";

import { useRef, useState } from "react";
import { archivePhotos } from "@/data/archive";
import { ui } from "@/data/site";
import { gsap, useGSAP, MEDIA } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { ArrowBackIcon, ArrowIcon } from "@/components/ui/Icons";
import { Ornament } from "@/components/ui/Ornament";

const total = archivePhotos.length;

/** three photographs laid out as a fan, the middle one carrying the composition */
const layout = [
  { rotation: 7, scale: 0.92, y: 14, width: "w-[32%] md:w-[30%]", overlap: "-ml-[5%]", z: "z-0" },
  { rotation: 0, scale: 1, y: 0, width: "w-[38%] md:w-[34%]", overlap: "", z: "z-10" },
  { rotation: -7, scale: 0.92, y: 14, width: "w-[32%] md:w-[30%]", overlap: "-mr-[5%]", z: "z-0" },
];

/** On the archive paper ground: ink on old paper, as the guide sets it. */
export function ArchiveFan() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const revealed = useRef(false);

  const visible = [0, 1, 2].map((k) => archivePhotos[(index + k) % total]);

  const settle = (cards: NodeListOf<HTMLElement>, direction: 1 | -1) =>
    cards.forEach((card, i) => {
      const l = layout[i];
      gsap.fromTo(
        card,
        { opacity: 0, y: 46, x: 26 * direction, rotation: 0, scale: 0.9 },
        {
          opacity: 1,
          y: l.y,
          x: 0,
          rotation: l.rotation,
          scale: l.scale,
          duration: 0.95,
          delay: i === 1 ? 0 : 0.08,
          ease: "expo.out",
          overwrite: true,
        },
      );
    });

  /* first appearance — set up once, so the scroll triggers are never duplicated */
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const cards = root.querySelectorAll<HTMLElement>("[data-card]");
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          root.querySelectorAll("[data-reveal]"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
          },
        );
        cards.forEach((card, i) => {
          const l = layout[i];
          gsap.fromTo(
            card,
            { opacity: 0, y: 60, rotation: 0, scale: 0.9 },
            {
              opacity: 1,
              y: l.y,
              rotation: l.rotation,
              scale: l.scale,
              duration: 1.3,
              delay: i === 1 ? 0 : 0.12,
              ease: "expo.out",
              scrollTrigger: { trigger: root, start: "top 72%", once: true },
              onComplete: () => {
                revealed.current = true;
              },
            },
          );
        });
      });

      mm.add(MEDIA.reduced, () => {
        revealed.current = true;
        gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
        cards.forEach((card, i) => gsap.set(card, { opacity: 1, rotation: layout[i].rotation, y: layout[i].y, scale: layout[i].scale }));
      });
    },
    { scope: ref },
  );

  /* re-deal the fan whenever the visitor pages through */
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !revealed.current) return;
      if (prefersReducedMotion()) return;
      settle(root.querySelectorAll<HTMLElement>("[data-card]"), 1);
    },
    { dependencies: [index], scope: ref },
  );

  const arrow =
    "inline-flex h-11 w-11 items-center justify-center border border-blue/40 text-blue transition-colors duration-300 hover:bg-blue hover:text-paper";

  return (
    <section ref={ref} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="px-gutter relative">
        <div className="mx-auto max-w-3xl text-center">
          <p data-reveal className="eyebrow opacity-0">
            الأرشيف
          </p>
          <h2 data-reveal className="text-display mt-4 text-[clamp(2.25rem,4.6vw,4rem)] text-blue opacity-0">
            صور من الأرشيف
          </h2>
          <span data-reveal className="rule-gold mx-auto mt-5 opacity-0" aria-hidden="true" />
        </div>

        <div className="mt-14 flex items-center justify-center md:mt-16">
          {visible.map((item, i) => {
            const l = layout[i];
            return (
              <div key={`${item.id}-${i}`} data-card className={cn(l.width, l.overlap, l.z, "shrink-0 opacity-0")}>
                <MediaFrame media={item.media} ratio={3 / 4} tone="paper" interactive showLabel={false} unitSize={i === 1 ? "md" : "sm"} />
              </div>
            );
          })}
        </div>

        {/* caption of the middle plate, then the controls */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <p data-reveal className="text-center text-[0.8rem] tracking-[0.08em] text-ink/60 opacity-0">
            <Slot value={visible[1].title} className="text-ink/70" />
          </p>

          <div data-reveal className="flex items-center gap-5 opacity-0">
            <button type="button" onClick={() => setIndex((v) => (v - 1 + total) % total)} className={arrow} aria-label={ui.prev}>
              <ArrowBackIcon className="h-4 w-4" />
            </button>
            <span className="text-[0.72rem] tracking-[0.1em] text-ink/60 tabular-nums" dir="ltr" aria-live="polite">
              {String(index + 1).padStart(2, "0")}
              <span className="text-ink/35"> / {String(total).padStart(2, "0")}</span>
            </span>
            <button type="button" onClick={() => setIndex((v) => (v + 1) % total)} className={arrow} aria-label={ui.next}>
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>

          <div data-reveal className="opacity-0">
            <TransitionLink
              href="/archive"
              className="group inline-flex h-12 items-center gap-3 rounded-ui border border-blue px-7 text-[0.82rem] font-medium tracking-[0.1em] text-blue transition-colors duration-300 hover:bg-blue hover:text-paper"
            >
              {ui.viewAll}
              <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
            </TransitionLink>
          </div>
        </div>

        <Ornament unit="rose" className="pointer-events-none absolute -bottom-6 start-6 w-14 text-kraft/60" />
      </div>
    </section>
  );
}
