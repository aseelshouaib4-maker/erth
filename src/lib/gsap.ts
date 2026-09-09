"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

let registered = false;

/** Registers GSAP plugins exactly once (client only). */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (process.env.NODE_ENV !== "production") {
    // handy for inspecting tweens from the browser console during development
    (window as unknown as { __gsap?: typeof gsap; __ScrollTrigger?: typeof ScrollTrigger }).__gsap = gsap;
    (window as unknown as { __ScrollTrigger?: typeof ScrollTrigger }).__ScrollTrigger = ScrollTrigger;
    // Browsers suspend requestAnimationFrame in hidden tabs and embedded preview
    // panes, which freezes GSAP. In development a watchdog ticks manually
    // whenever the frame counter stops moving. Production is untouched.
    gsap.ticker.lagSmoothing(0);
    let lastFrame = -1;
    window.setInterval(() => {
      if (gsap.ticker.frame === lastFrame) {
        gsap.ticker.tick();
        ScrollTrigger.update();
      }
      lastFrame = gsap.ticker.frame;
    }, 100);
  }
  registered = true;
}

registerGsap();

/** Shared matchMedia conditions used across components. */
export const MEDIA = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/** Arabic-safe SplitText: never split characters (it breaks letter joining). */
export function splitLines(target: gsap.DOMTarget, type: "lines" | "lines,words" = "lines") {
  return new SplitText(target, {
    type,
    linesClass: "split-line",
    wordsClass: "split-word",
    mask: type === "lines" ? "lines" : undefined,
  });
}

/** Horizontal direction helper: in RTL, content flows from the right. */
export function dirX(value: number, dir: "rtl" | "ltr" = "rtl") {
  return dir === "rtl" ? value : -value;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
