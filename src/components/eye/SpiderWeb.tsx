"use client";

import { useRef } from "react";
import { eyeCopy } from "@/data/eye";
import { gsap, useGSAP, MEDIA } from "@/lib/gsap";
import { Slot } from "@/components/ui/Placeholders";
import { ArrowDownIcon } from "@/components/ui/Icons";

/* ------------------------------------------------------------------
   Web geometry — computed once at module scope so the server and the
   client render exactly the same path data.
------------------------------------------------------------------ */
const VB = { w: 1000, h: 620 };
const CX = 500;
const CY = 275;
const R = 330;
const SPOKES = 14;
const RINGS = 7;

const angles = Array.from({ length: SPOKES }, (_, i) => (i / SPOKES) * Math.PI * 2 - Math.PI / 2);
const radii = Array.from({ length: RINGS }, (_, j) => R * (0.16 + (0.84 * j) / (RINGS - 1)));

const at = (a: number, r: number): [number, number] => [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
const fixed = ([x, y]: [number, number]) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/** one ring, each span sagging inward the way silk does */
function ringPath(r: number) {
  let d = `M${fixed(at(angles[0], r))}`;
  for (let i = 0; i < SPOKES; i += 1) {
    const a = angles[i];
    const next = i === SPOKES - 1 ? angles[0] + Math.PI * 2 : angles[i + 1];
    const mid = (a + next) / 2;
    d += `Q${fixed(at(mid, r * 0.9))} ${fixed(at(next, r))}`;
  }
  return `${d}Z`;
}

const rings = radii.map(ringPath);
const spokes = angles.map((a) => `M${fixed([CX, CY])}L${fixed(at(a, R))}`);
/** threads running off the frame, holding the whole thing up */
const anchors = [1, 4, 6, 9, 12].map((i) => `M${fixed(at(angles[i], R))}L${fixed(at(angles[i], R * 2.1))}`);

/** spiders sit on a ring, given by spoke index and ring index */
const spiders = [
  { spoke: 2, ring: 4, scale: 1, delay: 0 },
  { spoke: 8, ring: 2, scale: 0.78, delay: 0.8 },
  { spoke: 11, ring: 5, scale: 0.62, delay: 1.6 },
].map((s) => ({ ...s, pos: at(angles[s.spoke], radii[s.ring]) }));

const legs = [-0.9, -0.45, 0.45, 0.9].flatMap((tilt) =>
  [-1, 1].map((side) => {
    const x1 = side * 4;
    const y1 = tilt * 2.2;
    const x2 = side * 11;
    const y2 = tilt * 8 - 3;
    const x3 = side * 15;
    const y3 = tilt * 11 + 3;
    return `M${x1} ${y1}Q${x2} ${y2} ${x3} ${y3}`;
  }),
);

function Spider({ scale }: { scale: number }) {
  return (
    <g transform={`scale(${scale})`}>
      {legs.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
      ))}
      <ellipse cx="0" cy="1.5" rx="3.4" ry="4.6" fill="currentColor" />
      <circle cx="0" cy="-4.2" r="2.5" fill="currentColor" />
    </g>
  );
}

/**
 * «عين» hero. The web hangs and breathes, then loses its anchors as the page
 * scrolls: it trembles, threads snap, and the whole sheet falls away with the
 * spiders still on it. Only transforms and dash offsets are animated.
 */
export function SpiderWeb() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const sway = root.querySelector<SVGGElement>("[data-sway]");
      const shake = root.querySelector<SVGGElement>("[data-shake]");
      const spiderNodes = root.querySelectorAll<SVGGElement>("[data-spider]");
      const crawlNodes = root.querySelectorAll<SVGGElement>("[data-crawl]");
      if (!sway || !shake) return;

      // every thread gets a dash the length of itself, so it can retract
      const threads = Array.from(root.querySelectorAll<SVGPathElement>("[data-thread]"));
      threads.forEach((path) => {
        const len = path.getTotalLength();
        path.dataset.len = String(len);
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: 0 });
      });
      const snapping = threads.filter((p) => p.dataset.snap === "true");

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        // idle: the sheet breathes on its anchors
        gsap.to(sway, {
          rotation: 0.9,
          x: 6,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "50% 0%",
        });
        crawlNodes.forEach((node, i) => {
          gsap.to(node, {
            x: i % 2 === 0 ? 9 : -7,
            y: i % 2 === 0 ? -5 : 6,
            rotation: i % 2 === 0 ? 8 : -10,
            duration: 3 + i * 0.7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.4,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=130%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1 — tremble
        tl.to(shake, {
          keyframes: [
            { x: -7, rotation: -0.8, duration: 0.2 },
            { x: 8, rotation: 0.9, duration: 0.2 },
            { x: -6, rotation: -0.7, duration: 0.2 },
            { x: 5, rotation: 0.6, duration: 0.2 },
            { x: 0, rotation: 0, duration: 0.2 },
          ],
          ease: "none",
        });

        // 2 — anchors and a few threads give way
        tl.to(
          snapping,
          {
            strokeDashoffset: (_i, target) => Number((target as SVGPathElement).dataset.len ?? 0),
            duration: 0.55,
            stagger: { each: 0.06, from: "random" },
            ease: "power2.in",
          },
          0.55,
        );

        // 3 — the sheet sags under its own weight
        tl.to(shake, { scaleY: 1.16, y: 34, transformOrigin: "50% 0%", duration: 0.5, ease: "power2.in" }, 0.75);

        // 4 — and falls, taking the spiders with it
        tl.to(shake, { y: 780, rotation: 6, scaleY: 0.9, opacity: 0.12, duration: 1, ease: "power2.in" }, 1.25);
        tl.to(
          spiderNodes,
          {
            y: 840,
            x: (i: number) => [-34, 22, -14][i % 3],
            rotation: (i: number) => [26, -20, 34][i % 3],
            duration: 1,
            ease: "power2.in",
            stagger: 0.05,
          },
          1.2,
        );
        tl.to(root.querySelectorAll("[data-eye-anim]"), { opacity: 0.35, y: -18, duration: 0.6, ease: "none" }, 1.3);
      });

      mm.add(MEDIA.reduced, () => {
        gsap.set(sway, { rotation: 0, x: 0 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden bg-night">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="pointer-events-none absolute inset-0 h-full w-full text-cream/45"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <g data-sway>
          <g data-shake>
            {anchors.map((d, i) => (
              <path
                key={`anchor-${i}`}
                data-thread
                data-snap="true"
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                opacity={0.55}
              />
            ))}
            {spokes.map((d, i) => (
              <path
                key={`spoke-${i}`}
                data-thread
                data-snap={i % 4 === 1 ? "true" : undefined}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.9}
                opacity={0.5}
              />
            ))}
            {rings.map((d, i) => (
              <path
                key={`ring-${i}`}
                data-thread
                data-snap={i === 2 || i === 5 ? "true" : undefined}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={i === RINGS - 1 ? 1.2 : 0.8}
                opacity={0.42}
              />
            ))}
            {/* a gold thread catches the light, as the guide asks of the accent */}
            <path d={rings[3]} fill="none" stroke="var(--color-gold)" strokeWidth={0.9} opacity={0.55} data-thread />

            <g className="text-cream/80">
              {spiders.map((s, i) => (
                <g key={`spider-${i}`} data-spider transform={`translate(${fixed(s.pos)})`}>
                  <g data-crawl>
                    <Spider scale={s.scale} />
                  </g>
                </g>
              ))}
            </g>
          </g>
        </g>
      </svg>

      <div className="px-gutter relative flex min-h-[100svh] flex-col items-center justify-center pb-16 pt-24 text-center">
        <div className="rounded-none bg-night/45 px-6 py-8 backdrop-blur-[2px] md:px-12">
          <p data-eye-anim className="eyebrow tracking-sep">
            {eyeCopy.eyebrow}
          </p>
          <h1 data-eye-anim className="text-display mt-2 text-[clamp(2.75rem,9vw,7rem)] leading-none text-cream">
            {eyeCopy.title}
          </h1>
          <p data-eye-anim className="mx-auto mt-4 max-w-md text-[0.95rem] leading-[1.9] text-blue-32">
            <Slot value={eyeCopy.lead} />
          </p>
        </div>

        <div data-eye-anim className="mt-10 flex items-center gap-3 text-blue-54">
          <ArrowDownIcon className="h-4 w-4 text-gold" />
          <span className="text-[0.68rem] tracking-[0.1em]">مرّر ليسقط النسيج</span>
        </div>
      </div>
    </section>
  );
}
