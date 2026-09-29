"use client";

import { useRef, useState } from "react";
import {
  contributeAccept,
  contributeCopy,
  contributeRequirements,
  contributeSteps,
  contributorFields,
  linkFields,
  materialFields,
  stepLabel,
  type ContributeField,
} from "@/data/contribute";
import { brand } from "@/data/site";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { Logo } from "@/components/ui/Brand";
import { CloseIcon, UploadIcon } from "@/components/ui/Icons";

/** حجم الملفّ بصيغة يقرأها الإنسان. */
function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} كيلوبايت`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ميغابايت`;
}

/** حقل واحد بالهيئة الموحّدة: إطار وأرضيّة فاتحة، لا خطّ سفلي. */
function Field({ field }: { field: ContributeField }) {
  return (
    <label htmlFor={field.id} className={cn("block", field.wide && "sm:col-span-2")}>
      <span className="eyebrow text-ink/60">
        {field.label}
        {field.required && <span className="text-gold"> *</span>}
      </span>
      {field.type === "textarea" ? (
        <textarea
          id={field.id}
          name={field.id}
          rows={5}
          required={field.required}
          placeholder={field.placeholder}
          className="field mt-2.5 resize-y"
        />
      ) : (
        <input
          id={field.id}
          name={field.id}
          type={field.type}
          required={field.required}
          placeholder={field.placeholder}
          dir={field.type === "tel" || field.type === "url" ? "ltr" : undefined}
          className={cn("field mt-2.5", (field.type === "tel" || field.type === "url") && "text-start")}
        />
      )}
      {field.hint && <span className="mt-2 block text-[0.72rem] leading-[1.7] text-ink/65">{field.hint}</span>}
    </label>
  );
}

/** رأس خطوة: رقمها وعنوانها، فيقرأ الزائر الاستمارة على ثلاث دفعات. */
function StepHead({ n, title, note }: { n: number; title: string; note?: string }) {
  return (
    <div data-reveal className="mb-7 flex items-baseline gap-4 border-b border-ink/12 pb-4">
      <span className="shrink-0 rounded-ui border border-gold/50 px-2.5 py-1 text-[0.68rem] tracking-[0.1em] text-gold tabular-nums">
        {stepLabel(n)}
      </span>
      <span className="min-w-0">
        <span className="text-heading block text-[1.1rem] text-blue md:text-[1.25rem]">{title}</span>
        {note && <span className="mt-1 block text-[0.78rem] leading-[1.7] text-ink/65">{note}</span>}
      </span>
    </div>
  );
}

/**
 * «شارك بالتوثيق»: الملفّات تُعرض ولا تُرفع — لا خادم خلف النموذج بعد.
 */
export function ContributeForm() {
  const ref = useReveal<HTMLDivElement>();
  const [files, setFiles] = useState<File[]>([]);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setSent(false);
    setFiles((current) => {
      const seen = new Set(current.map((f) => `${f.name}:${f.size}`));
      const added = Array.from(list).filter((f) => !seen.has(`${f.name}:${f.size}`));
      return [...current, ...added];
    });
  };

  const removeFile = (name: string, size: number) => {
    setFiles((current) => current.filter((f) => !(f.name === name && f.size === size)));
  };

  return (
    <section id="contribute" ref={ref} className="scroll-mt-24 bg-paper pb-24 md:pb-32">
      <div className="px-gutter mx-auto max-w-4xl">
        <header data-reveal className="border-t border-ink/15 pt-12 md:pt-16">
          <Ornament unit="star" className="w-9 text-gold" />
          <p className="eyebrow mt-5">{contributeCopy.eyebrow}</p>
          <h2 className="text-heading mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] text-blue">{contributeCopy.title}</h2>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-[1.9] text-ink/70">{contributeCopy.lead}</p>
        </header>

        {/* ما يحتاج معرفته قبل أن يبدأ */}
        <div data-reveal className="mt-10 rounded-ui border border-ink/15 bg-newsprint/40 p-7 md:p-9">
          <h3 className="text-heading text-[1.15rem] text-blue md:text-[1.3rem]">{contributeCopy.requirementsTitle}</h3>
          <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.9] text-ink/65">{contributeCopy.requirementsLead}</p>
          <dl className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {contributeRequirements.map((r) => (
              <div key={r.title} className="border-t border-ink/15 pt-4">
                <dt className="eyebrow text-ink/60">{r.title}</dt>
                <dd className="mt-2 text-[0.88rem] leading-[1.85] text-ink/70">{r.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <h3 data-reveal className="text-heading mt-14 text-[1.25rem] text-blue md:text-[1.45rem]">
          {contributeCopy.formTitle}
        </h3>
        <p data-reveal className="mt-2 text-[0.75rem] tracking-[0.08em] text-ink/65">{contributeCopy.required}</p>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {/* ١ — مَن أنت */}
          <fieldset>
            <legend className="sr-only">{contributeSteps[0].title}</legend>
            <StepHead {...contributeSteps[0]} />
            <div data-reveal className="grid gap-5 sm:grid-cols-2 sm:gap-x-6">
              {contributorFields.map((field) => (
                <Field key={field.id} field={field} />
              ))}
            </div>
          </fieldset>

          {/* ٢ — المادّة */}
          <fieldset className="mt-12">
            <legend className="sr-only">{contributeSteps[1].title}</legend>
            <StepHead {...contributeSteps[1]} />
            <div data-reveal className="grid gap-5 sm:grid-cols-2 sm:gap-x-6">
              {materialFields.map((field) => (
                <Field key={field.id} field={field} />
              ))}
            </div>

            <div data-reveal className="mt-7">
              <p className="eyebrow text-ink/60">{contributeCopy.filesLabel}</p>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
                className="mt-2.5 cursor-pointer rounded-ui border border-dashed border-ink/25 bg-newsprint/30 p-8 text-center transition-colors duration-300 hover:border-blue hover:bg-newsprint/50 md:p-10"
              >
                <UploadIcon className="mx-auto h-7 w-7 text-gold" />
                <p className="text-heading mt-4 text-[1.05rem] text-blue">{contributeCopy.dropHint}</p>
                <p className="mt-2 text-[0.82rem] leading-[1.8] text-ink/65">{contributeCopy.filesHint}</p>
                <input
                  ref={inputRef}
                  id="materialFiles"
                  name="materialFiles"
                  type="file"
                  multiple
                  accept={contributeAccept}
                  onChange={(e) => addFiles(e.target.files)}
                  onClick={(e) => e.stopPropagation()}
                  className="sr-only"
                />
                <Button
                  variant="paper-solid"
                  size="lg"
                  className="mt-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  {contributeCopy.choose}
                </Button>
              </div>

              <div className="mt-5">
                <p className="eyebrow text-ink/60" aria-live="polite">
                  {contributeCopy.chosen} · <span className="tabular-nums">{files.length}</span>
                </p>
                {files.length === 0 ? (
                  <p className="mt-2 text-[0.8rem] text-ink/65">{contributeCopy.empty}</p>
                ) : (
                  <ul className="mt-3 divide-y divide-ink/10 rounded-ui border border-ink/12 bg-newsprint/25">
                    {files.map((file) => (
                      <li key={`${file.name}:${file.size}`} className="flex items-center justify-between gap-4 px-4 py-3">
                        <span className="min-w-0">
                          <span className="block truncate text-[0.9rem] text-ink">{file.name}</span>
                          <span className="mt-0.5 block text-[0.68rem] tracking-[0.08em] text-ink/65">
                            {humanSize(file.size)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(file.name, file.size)}
                          aria-label={`${contributeCopy.remove} — ${file.name}`}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-ui border border-ink/20 text-ink/65 transition-colors duration-300 hover:border-blue hover:text-blue"
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </fieldset>

          {/* ٣ — الرابط */}
          <fieldset className="mt-12">
            <legend className="sr-only">{contributeSteps[2].title}</legend>
            <StepHead {...contributeSteps[2]} />
            <div data-reveal className="grid gap-5 sm:grid-cols-2 sm:gap-x-6">
              {linkFields.map((field) => (
                <Field key={field.id} field={field} />
              ))}
            </div>
          </fieldset>

          <div data-reveal className="mt-12 flex flex-wrap items-center gap-6 border-t border-ink/12 pt-10">
            <Button type="submit" variant="paper-solid" size="lg" arrow>
              {contributeCopy.submit}
            </Button>
            <p className="text-[0.72rem] leading-[1.8] tracking-[0.06em] text-ink/65" role="status" aria-live="polite">
              {sent ? contributeCopy.sent : contributeCopy.uiNote}
            </p>
          </div>
        </form>

        <div data-reveal className="mt-20 flex items-center justify-center gap-6 text-gold">
          <Logo height={64} />
          <p className="eyebrow tracking-sep">{brand.tagline}</p>
        </div>
      </div>
    </section>
  );
}
