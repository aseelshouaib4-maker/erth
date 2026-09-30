"use client";

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "@/lib/gsap";

/**
 * يربط أقسام الصفحة الرئيسية ببعضها بدل أن تتتابع كشرائح ساكنة.
 *
 * حيلتان لا أكثر، ولا واحدة منهما «تلاشٍ عند الظهور»:
 *
 * ١ — أرضيّات الزخرفة تنجرف أبطأ من النصّ، فيولد عمقٌ يعبر حدود الأقسام.
 * ٢ — الفاتحة تُسلّم ما بعدها: ترتفع وتخفت وأنت تغادرها، فيصل القسم التالي فوقها.
 *
 * لا خيط بين الأقسام ولا في الهامش: تبدّل الأرضيّة وحده يفصلها.
 * كل شيء يتوقّف عند «prefers-reduced-motion».
 */
export function HomeFlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

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
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}
