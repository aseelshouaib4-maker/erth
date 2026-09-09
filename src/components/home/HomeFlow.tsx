"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MEDIA } from "@/lib/gsap";
import { Ornament } from "@/components/ui/Ornament";

/**
 * يربط أقسام الصفحة الرئيسية ببعضها بدل أن تتتابع كشرائح ساكنة.
 *
 * ثلاث حِيَل لا أكثر، ولا واحدة منها «تلاشٍ عند الظهور»:
 *
 * ١ — أرضيّات الزخرفة تنجرف أبطأ من النصّ، فيولد عمقٌ يعبر حدود الأقسام.
 * ٢ — الفاتحة تُسلّم ما بعدها: ترتفع وتخفت وأنت تغادرها، فيصل القسم التالي فوقها.
 * ٣ — خيط في الهامش تركبه وحدة زخرفيّة تنزل مع القراءة، فتنتقل بين الأقسام فعلاً.
 *
 * الحدود بين الأقسام تبقى بلا خيط: تبدّل الأرضيّة وحده يفصلها.
 * كل شيء يتوقّف عند «prefers-reduced-motion».
 */
export function HomeFlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const riderRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section"));

        /* ١ — عمق: الأرضيّة الزخرفيّة تنجرف، وإطارات المواد تتخلّف قليلاً عن النصّ */
        sections.forEach((section) => {
          const ground = section.querySelector<SVGElement>("svg.absolute.inset-0");
          if (ground && !ground.closest("button, a, article")) {
            gsap.fromTo(
              ground,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }

          /* المسافة صغيرة عمدًا: إحساسٌ بالعمق، لا حركةٌ تلفت النظر */
          const frames = Array.from(section.querySelectorAll<HTMLElement>('[role="img"]'))
            .filter((f) => !f.closest("button, a"))
            .slice(0, 4);
          frames.forEach((frame, i) => {
            const depth = 9 + (i % 2) * 5;
            gsap.fromTo(
              frame,
              { y: -depth },
              {
                y: depth,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });
        });

        /* ٢ — الفاتحة تُسلّم ما بعدها */
        const hero = sections[0];
        const heroInner = hero?.querySelector<HTMLElement>(":scope > div:not([aria-hidden])");
        if (hero && heroInner) {
          gsap.to(heroInner, {
            y: -70,
            opacity: 0.25,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        /* ٣ — الوحدة الزخرفيّة تنزل الهامش مع القراءة */
        const fill = fillRef.current;
        const rider = riderRef.current;
        const rail = railRef.current;
        if (fill && rider && rail) {
          gsap.set(fill, { transformOrigin: "top center", scaleY: 0 });
          ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(fill, { scaleY: p });
              gsap.set(rider, { top: `${p * 100}%` });
            },
          });
        }
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      {/* خيط الهامش — على الشاشات الواسعة وحدها، ولا يعترض النقر */}
      <div
        ref={railRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-5 z-30 hidden w-px xl:block"
      >
        <span className="absolute inset-0 bg-cream/8" />
        <span ref={fillRef} className="absolute inset-0 bg-gold/45" />
        <span ref={riderRef} className="absolute -start-[7px] top-0 -translate-y-1/2">
          <Ornament unit="star" className="w-[15px] text-gold" />
        </span>
      </div>

      {children}
    </div>
  );
}
