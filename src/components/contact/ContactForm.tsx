"use client";

import { contact } from "@/data/site";
import { contributeCopy } from "@/data/contribute";
import { useReveal } from "@/hooks/useReveal";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";

type Door = "contribute" | "volunteer";

type Props = {
  /** أيّ بابٍ مفتوح الآن — أو لا شيء */
  open: Door | null;
  onOpen: (door: Door) => void;
};

/** Two ways to reach the institution: send it a document, or join it. */
export function ContactForm({ open, onOpen }: Props) {
  const ref = useReveal<HTMLDivElement>();

  const cardClass =
    "flex flex-col rounded-ui border border-ink/15 bg-newsprint/40 p-8 shadow-ui transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-lift md:p-10";

  return (
    <div ref={ref} className="bg-paper pt-4 pb-16 md:pb-20">
      <div className="px-gutter mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
        {/* send us a document */}
        <section data-reveal className={cardClass}>
          <Ornament unit="leaf" className="w-9 text-gold" />
          <p className="eyebrow mt-6">{contributeCopy.eyebrow}</p>
          <h2 className="text-heading mt-3 text-[1.35rem] text-blue md:text-[1.6rem]">شارك بوثيقة</h2>
          <p className="mt-4 max-w-sm text-[0.9rem] leading-[1.9] text-ink/70">
            عند كثيرين وثيقة أو صورة أو تسجيل لم يدخل الأرشيف بعد. اطّلع على الشروط، ثمّ أرسل ما عندك.
          </p>
          <div className="mt-auto pt-8">
            <Button
              variant="paper"
              size="lg"
              arrow
              className="w-full sm:w-auto"
              onClick={() => onOpen("contribute")}
              aria-expanded={open === "contribute"}
              aria-controls="contribute"
            >
              شارك معنا
            </Button>
            <p className="mt-3 text-[0.78rem] tracking-[0.06em] text-ink/65">الشروط ثمّ استمارة الإرسال</p>
          </div>
        </section>

        {/* join us */}
        <section data-reveal className={cardClass}>
          <Ornament unit="leaf" className="w-9 text-gold" />
          <p className="eyebrow mt-6">انضمّ إلى الفريق</p>
          <h2 className="text-heading mt-3 text-[1.35rem] text-blue md:text-[1.6rem]">تطوّع معنا</h2>
          <p className="mt-4 max-w-sm text-[0.9rem] leading-[1.9] text-ink/70">
            تفتح المؤسّسة باب التطوّع أمام أصحاب الاختصاصات والكفاءات والمهارات كافّة.
          </p>
          <div className="mt-auto pt-8">
            <Button
              variant="paper"
              size="lg"
              arrow
              className="w-full sm:w-auto"
              onClick={() => onOpen("volunteer")}
              aria-expanded={open === "volunteer"}
              aria-controls="volunteer"
            >
              املأ الاستمارة
            </Button>
            <p className="mt-3 text-[0.78rem] tracking-[0.06em] text-ink/65">استمارة طلب تطوّع</p>
          </div>
        </section>
      </div>

      {/* البريد لم يعد بطاقةً، لكنّه يبقى مذكورًا */}
      <p data-reveal className="px-gutter mx-auto mt-8 max-w-5xl text-[0.88rem] text-ink/60">
        للاستفسارات والمقترحات وطلبات التعاون:{" "}
        <a
          href={`mailto:${contact.email}`}
          dir="ltr"
          className="text-blue underline decoration-gold/50 underline-offset-8 transition-colors hover:decoration-gold"
        >
          {contact.email}
        </a>
      </p>
    </div>
  );
}
