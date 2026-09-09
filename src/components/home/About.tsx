"use client";

import { about } from "@/data/about";
import { brand } from "@/data/site";
import { useReveal } from "@/hooks/useReveal";
import { Logo } from "@/components/ui/Brand";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** «من نحن» — text reproduced exactly as supplied. */
export function About() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="about" ref={ref} className="relative bg-blue py-24 md:py-36">
      <div className="px-gutter grid gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <SectionHeader eyebrow={about.title} title={about.name} size="lg" />
          <div className="mt-10 max-w-2xl space-y-6">
            {about.paragraphs.map((p, i) => (
              <p key={i} data-reveal className="border-s border-gold/40 ps-5 text-[0.95rem] leading-[1.9] text-cream/85">
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-8 md:col-span-4 md:col-start-9">
          <div data-reveal className="text-gold">
            <Logo height={260} />
          </div>
          <p data-reveal className="eyebrow tracking-sep">
            {brand.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
