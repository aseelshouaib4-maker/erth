"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { Logo, Wordmark } from "@/components/ui/Brand";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";

/** أقصر مدّة تُعرض فيها الشاشة، حتى لا تومض ثم تختفي. */
const MIN_MS = 700;

/**
 * شاشة التحميل — أوّل ما يُرى عند فتح الموقع.
 *
 * تبقى حتى تجهز الخطوط وتكتمل الصفحة، ثم تنسحب صعوداً. تظهر مرّة واحدة
 * في الزيارة: التنقّل داخل الموقع بعدها يمرّ بستارة الانتقال لا بها.
 */
export function SiteLoader() {
  const [done, setDone] = useState(false);
  /* بعد الانسحاب تُزال الشاشة عبر React نفسه، لا بلمس الـDOM من خارجه */
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef(false);

  /* ينتظر الخطوط واكتمال التحميل، مع حدٍّ أدنى للعرض */
  useEffect(() => {
    let cancelled = false;
    const started = performance.now();

    const finish = () => {
      if (cancelled || readyRef.current) return;
      readyRef.current = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      window.setTimeout(() => {
        if (!cancelled) setDone(true);
      }, wait);
    };

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));

    Promise.all([loaded, document.fonts ? document.fonts.ready : Promise.resolve()]).then(finish);

    /* شبكة أمان: لا تحتجز الزائر إن تأخّر مورد */
    const bail = window.setTimeout(finish, 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(bail);
    };
  }, []);

  /* الخيط الذهبي يزحف ما دامت الشاشة قائمة، ثم تنسحب الشاشة */
  useGSAP(
    () => {
      const root = rootRef.current;
      const bar = barRef.current;
      if (!root || !bar) return;
      const reduced = prefersReducedMotion();

      if (!done) {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 0.9, duration: reduced ? 0 : 2.2, ease: "power2.out" });
        return;
      }

      gsap
        .timeline({ onComplete: () => setGone(true) })
        .to(bar, { scaleX: 1, duration: reduced ? 0 : 0.28, ease: "power2.in" })
        .to(root, { yPercent: -100, duration: reduced ? 0 : 0.75, ease: "expo.inOut" }, reduced ? 0 : ">-0.05");
    },
    { dependencies: [done] },
  );

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-blue text-cream"
      role="status"
      aria-live="polite"
      aria-label="جارٍ التحميل"
    >
      <OrnamentGrid scale={2} fade="edges" opacity={0.07} />

      <div className="relative flex flex-col items-center">
        <Logo height={76} className="text-gold" />
        <div className="mt-7 text-cream">
          <Wordmark height={34} />
        </div>
        <p className="eyebrow tracking-sep mt-4">{brand.tagline}</p>
      </div>

      {/* خيط التقدّم — نقطة الضوء الوحيدة */}
      <span className="relative mt-12 block h-px w-40 bg-cream/15 md:w-56" aria-hidden="true">
        <span ref={barRef} className="absolute inset-0 origin-right bg-gold" />
      </span>
    </div>
  );
}
