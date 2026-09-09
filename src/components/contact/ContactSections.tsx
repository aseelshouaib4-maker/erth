"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils";
import { volunteerCopy } from "@/data/volunteer";
import { Ornament } from "@/components/ui/Ornament";
import { VolunteerForm } from "@/components/volunteer/VolunteerForm";
import { ContactForm } from "./ContactForm";
import { ContributeForm } from "./ContributeForm";

/** أيّ بابٍ مفتوح الآن — أو لا شيء. */
type Door = "contribute" | "volunteer" | null;

/**
 * صفحة «تواصل»: البطاقتان أوّلاً، ولا شيء غيرهما.
 * تنفتح الاستمارة تحتهما حين يطلبها الزائر، لا في صفحةٍ أخرى:
 * «شارك معنا» يفتح شروط التوثيق واستمارته، و«املأ الاستمارة» يفتح استمارة التطوّع.
 * بابٌ واحد في كل مرّة، حتى لا تطول الصفحة بلا داعٍ.
 */
export function ContactSections() {
  const [open, setOpen] = useState<Door>(null);

  /* رابطٌ من التذييل أو من الصفحة الرئيسية يفتح الباب المقصود فورًا */
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (hash === "#contribute") setOpen("contribute");
      else if (hash === "#volunteer") setOpen("volunteer");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  /* بعد أن يُركَّب القسم، ننتقل إليه */
  useEffect(() => {
    if (!open) return;
    document.getElementById(open)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, [open]);

  const toggle = (door: Exclude<Door, null>) => setOpen((current) => (current === door ? null : door));

  return (
    <>
      <ContactForm open={open} onOpen={toggle} />

      {open === "contribute" && <ContributeForm />}

      {open === "volunteer" && (
        <section id="volunteer" className="scroll-mt-24 bg-paper">
          <div className="px-gutter mx-auto max-w-4xl">
            <header className="border-t border-ink/15 pt-12 md:pt-16">
              <Ornament unit="star" className="w-9 text-gold" />
              <p className="eyebrow mt-5">{volunteerCopy.org}</p>
              <h2 className="text-heading mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] text-blue">{volunteerCopy.title}</h2>
              <p className="mt-5 max-w-2xl text-[0.95rem] leading-[1.9] text-ink/70">{volunteerCopy.lead}</p>
            </header>
          </div>
          <VolunteerForm />
        </section>
      )}
    </>
  );
}
