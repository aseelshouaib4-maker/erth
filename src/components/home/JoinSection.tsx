"use client";

import { contributeCopy } from "@/data/contribute";
import { useReveal } from "@/hooks/useReveal";
import { Ornament } from "@/components/ui/Ornament";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { ArrowIcon } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/layout/TransitionLink";

/**
 * آخر ما يقرؤه الزائر قبل التذييل: بابان فقط — أن يتطوّع، أو أن يشارك بالتوثيق.
 * على أرضيّة الورق نفسها التي تحمل صفحة «تواصل».
 *
 * البطاقة كلّها رابط واحد: ترتفع قليلاً عند المرور، ويشتدّ إطارها الذهبي،
 * وتظهر الزخرفة من تحتها. لا ظلال ثقيلة ولا زوايا مستديرة.
 */
type Door = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

const doors: Door[] = [
  {
    id: "volunteer",
    eyebrow: "انضمّ إلى الفريق",
    title: "تطوّع معنا",
    body: "تفتح المؤسّسة باب التطوّع أمام أصحاب الاختصاصات والكفاءات والمهارات كافّة.",
    cta: "املأ الاستمارة",
    href: "/contact#volunteer",
  },
  {
    id: "contribute",
    eyebrow: contributeCopy.eyebrow,
    title: contributeCopy.title,
    body: "عند كثيرين وثيقة أو صورة أو تسجيل لم يدخل الأرشيف بعد. أرسل ما عندك ويتولّى فريق التوثيق مراجعته.",
    cta: "أرسل مادّتك",
    href: "/contact#contribute",
  },
];

export function JoinSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-section relative overflow-hidden bg-paper">
      <OrnamentGrid scale={2} fade="edges" opacity={0.09} filled="var(--color-kraft)" outline="var(--color-kraft)" />

      <div className="px-gutter relative mx-auto max-w-5xl">
        {/* عنوان القسم — يرتّب ما تحته */}
        <header className="mb-14 max-w-2xl md:mb-20">
          <p data-reveal className="eyebrow">
            المشاركة
          </p>
          <h2 data-reveal className="text-display mt-5 text-[clamp(2rem,4.6vw,3.4rem)] text-balance text-blue">
            شارك في حفظ الإرث
          </h2>
          <span data-reveal className="rule-gold mt-6" aria-hidden="true" />
          <p data-reveal className="mt-6 text-[0.95rem] leading-[1.9] text-ink/65">
            بابان مفتوحان لمن أراد أن يكون من أهل هذا العمل — واحدٌ بالوقت والاختصاص، وآخرُ بما حفظته البيوت من وثائق وصور
            وتسجيلات.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {doors.map((door) => (
            <TransitionLink
              key={door.id}
              href={door.href}
              data-reveal
              className="group relative flex flex-col overflow-hidden rounded-ui border border-ink/15 bg-newsprint/40 p-8 shadow-ui transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-gold/70 hover:shadow-lift focus-visible:-translate-y-1.5 focus-visible:border-gold/70 md:p-10"
            >
              {/* الزخرفة تظهر من تحت البطاقة عند المرور */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <OrnamentGrid scale={2} fade="edges" opacity={0.16} filled="var(--color-kraft)" outline="var(--color-kraft)" />
              </span>

              {/* خيط ذهبي على حافة البطاقة العليا */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-right scale-x-0 bg-gold transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />

              {/* «الورقتان» في البطاقتين، كما في صفحة «تواصل معنا» — بلا ترقيم */}
              <Ornament
                unit="leaf"
                className="relative w-10 text-gold transition-transform duration-700 ease-out-expo group-hover:-translate-y-1 group-hover:scale-110 group-focus-visible:-translate-y-1 group-focus-visible:scale-110"
              />

              <p className="eyebrow relative mt-8">{door.eyebrow}</p>
              <h3 className="text-heading relative mt-3 text-[1.5rem] text-blue transition-colors duration-300 md:text-[1.85rem]">
                {door.title}
              </h3>
              <span
                aria-hidden="true"
                className="relative mt-5 block h-px w-16 bg-ink/20 transition-[width,background-color] duration-700 ease-out-expo group-hover:w-24 group-hover:bg-gold"
              />
              <p className="relative mt-6 text-[0.92rem] leading-[1.95] text-ink/65">{door.body}</p>

              {/* الدعوة: نصّ وسهم، لا زرّ داخل رابط */}
              <span className="relative mt-10 inline-flex items-center gap-3 border-t border-ink/12 pt-6 text-[0.82rem] font-medium tracking-[0.1em] text-blue transition-colors duration-300 group-hover:text-gold">
                {door.cta}
                <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1.5" />
              </span>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
