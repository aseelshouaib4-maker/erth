"use client";

import { useState } from "react";
import {
  academicFields,
  availabilityTimes,
  contactFields,
  departments,
  educationLevels,
  experienceFields,
  fieldFields,
  generalQuestions,
  languageColumns,
  languageLevels,
  languageRows,
  personalFields,
  volunteerRequired,
  volunteerStepLabel,
  volunteerSteps,
  specialtyIntro,
  specialtyNote,
  volunteerCopy,
  volunteerModes,
} from "@/data/volunteer";
import { useReveal } from "@/hooks/useReveal";
import { Button } from "@/components/ui/Button";
import { Slot } from "@/components/ui/Placeholders";
import { SpecialtyPicker } from "./SpecialtyPicker";

/** التسمية فوق الحقل، والنجمة ذهبيّة — كاستمارة «شارك بالتوثيق». */
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="eyebrow text-ink/60">
      {label}
      {required && <span className="text-gold"> *</span>}
    </span>
  );
}

function Field({
  label,
  id,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  type?: "text" | "email" | "tel" | "date" | "textarea";
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={id}>
      <FieldLabel label={label} required={required} />
      {type === "textarea" ? (
        <textarea id={id} name={id} rows={4} required={required} className="field mt-2.5 resize-y" />
      ) : (
        <input id={id} name={id} type={type} required={required} className="field mt-2.5" />
      )}
    </label>
  );
}

function Choice({
  name,
  value,
  type,
}: {
  name: string;
  value: string;
  type: "radio" | "checkbox";
}) {
  return (
    <label className="group inline-flex cursor-pointer items-center gap-2.5 text-[0.85rem] text-ink/75 transition-colors hover:text-ink">
      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-ui border border-ink/30 bg-white/55 transition-colors group-hover:border-blue">
        <input type={type} name={name} value={value} className="peer absolute inset-0 cursor-pointer opacity-0" />
        <span className="h-2 w-2 scale-0 bg-blue transition-transform peer-checked:scale-100" aria-hidden="true" />
      </span>
      {value}
    </label>
  );
}

/** رأس خطوة: شارتها ورقمها وعنوانها، كرؤوس خطوات «شارك بالتوثيق». */
function SectionBlock({ step, children }: { step: (typeof volunteerSteps)[number]; children: React.ReactNode }) {
  return (
    <section>
      <div data-reveal className="mb-7 flex items-baseline gap-4 border-b border-ink/12 pb-4">
        <span className="shrink-0 rounded-ui border border-gold/50 px-2.5 py-1 text-[0.68rem] tracking-[0.1em] text-gold tabular-nums">
          {volunteerStepLabel(step.n)}
        </span>
        <span className="min-w-0">
          <span className="text-heading block text-[1.1rem] text-blue md:text-[1.25rem]">{step.title}</span>
          {step.note && <span className="mt-1 block text-[0.78rem] leading-[1.7] text-ink/50">{step.note}</span>}
        </span>
      </div>
      <div data-reveal>{children}</div>
    </section>
  );
}

/** Visual form only — nothing is submitted anywhere yet. */
export function VolunteerForm() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.07 });
  const [sent, setSent] = useState(false);

  return (
    <div ref={ref} className="px-gutter bg-paper pb-24 pt-10 md:pb-32">
      <p data-reveal className="mx-auto mb-8 max-w-4xl text-[0.75rem] tracking-[0.08em] text-ink/45">
        {volunteerRequired}
      </p>

      <form
        className="mx-auto max-w-4xl space-y-12"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {/* أولاً */}
        <SectionBlock step={volunteerSteps[0]}>
          <div className="grid gap-8 sm:grid-cols-2">
            {personalFields.map((f) =>
              f.type === "radio" ? (
                <div key={f.id}>
                  <FieldLabel label={f.label} />
                  <div className="mt-4 flex flex-wrap gap-6">
                    {f.options!.map((o) => (
                      <Choice key={o} name={f.id} value={o} type="radio" />
                    ))}
                  </div>
                </div>
              ) : (
                <Field key={f.id} id={f.id} label={f.label} type={f.type} required={f.required} />
              ),
            )}
          </div>
        </SectionBlock>

        {/* ثانياً */}
        <SectionBlock step={volunteerSteps[1]}>
          <div className="grid gap-8 sm:grid-cols-2">
            {contactFields.map((f) => (
              <Field key={f.id} id={f.id} label={f.label} type={f.type} required={f.required} />
            ))}
          </div>
        </SectionBlock>

        {/* ثالثاً */}
        <SectionBlock step={volunteerSteps[2]}>
          <div className="space-y-10">
            <div>
              <FieldLabel label="المستوى التعليمي" />
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                {educationLevels.map((level) => (
                  <Choice key={level} name="educationLevel" value={level} type="radio" />
                ))}
              </div>
            </div>

            <div>
              <FieldLabel label="الاختصاص العلمي الدقيق" />
              <p className="mb-4 mt-2 max-w-2xl text-[0.82rem] leading-[1.9] text-ink/60">{specialtyIntro}</p>
              <SpecialtyPicker />
              <p className="mt-4 max-w-2xl text-[0.78rem] leading-[1.8] text-ink/45">{specialtyNote}</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {academicFields.map((f) => (
                <Field key={f.id} id={f.id} label={f.label} type={f.type} />
              ))}
            </div>
          </div>
        </SectionBlock>

        {/* رابعاً */}
        <SectionBlock step={volunteerSteps[3]}>
          <div className="space-y-10">
            <div className="grid gap-8 sm:grid-cols-2">
              {experienceFields.map((f) => (
                <Field key={f.id} id={f.id} label={f.label} type={f.type} />
              ))}
            </div>

            <div>
              <FieldLabel label="اللغات التي تتقنها ومستوى الإتقان (ممتاز / جيّد / مقبول)" />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-[0.85rem]">
                  <thead>
                    <tr>
                      {languageColumns.map((col) => (
                        <th key={col} className="border-b border-ink/20 pb-3 text-start text-[0.7rem] font-medium tracking-[0.1em] text-gold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: languageRows }, (_, r) => (
                      <tr key={r}>
                        <td className="border-b border-ink/10 py-2 pe-3">
                          <input
                            name={`language-${r}`}
                            aria-label={`اللغة ${r + 1}`}
                            className="field py-2"
                          />
                        </td>
                        {["reading", "writing", "speaking"].map((skill) => (
                          <td key={skill} className="border-b border-ink/10 py-2 pe-3">
                            <select
                              name={`language-${r}-${skill}`}
                              aria-label={`${languageColumns[["reading", "writing", "speaking"].indexOf(skill) + 1]} — اللغة ${r + 1}`}
                              defaultValue=""
                              className="field py-2"
                            >
                              <option value="">—</option>
                              {languageLevels.map((l) => (
                                <option key={l} value={l}>
                                  {l}
                                </option>
                              ))}
                            </select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* خامساً */}
        <SectionBlock step={volunteerSteps[4]}>
          <div className="space-y-10">
            <div>
              <FieldLabel label="القسم الذي ترغب بالتطوّع فيه (يمكن اختيار أكثر من قسم)" />
              <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {departments.map((d) => (
                  <Choice key={d} name="departments" value={d} type="checkbox" />
                ))}
              </div>
              <div className="mt-6 max-w-md">
                <Field id="otherDepartment" label="أخرى (حدّد)" />
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {fieldFields.map((f) => (
                <Field key={f.id} id={f.id} label={f.label} type={f.type} />
              ))}
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <FieldLabel label="الأوقات المفضّلة" />
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  {availabilityTimes.map((t) => (
                    <Choice key={t} name="availability" value={t} type="checkbox" />
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel label="نمط التطوّع" />
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  {volunteerModes.map((m) => (
                    <Choice key={m} name="mode" value={m} type="radio" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* سادساً */}
        <SectionBlock step={volunteerSteps[5]}>
          <div className="space-y-8">
            {generalQuestions.map((q, i) => (
              <label key={q} className="block" htmlFor={`question-${i}`}>
                <span className="flex gap-2 text-[0.9rem] leading-[1.8] text-ink/80">
                  <span className="text-gold tabular-nums">{i + 1}.</span>
                  {q}
                </span>
                <textarea id={`question-${i}`} name={`question-${i}`} rows={3} className="field mt-2.5 resize-y" />
              </label>
            ))}
          </div>
        </SectionBlock>

        <div data-reveal className="border-t border-ink/12 pt-10">
          <p className="text-[0.85rem] leading-[1.9] text-ink/65">
            {volunteerCopy.submitNote} <Slot value={volunteerCopy.submitEmail} />
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button type="submit" variant="paper-solid" size="lg" arrow>
              {volunteerCopy.submit}
            </Button>
            <p className="text-[0.7rem] leading-[1.8] tracking-[0.08em] text-ink/50" role="status" aria-live="polite">
              {sent ? volunteerCopy.sent : volunteerCopy.uiNote}
            </p>
          </div>
          <p className="text-heading mt-12 text-[1.05rem] text-gold">{volunteerCopy.thanks}</p>
        </div>
      </form>
    </div>
  );
}
