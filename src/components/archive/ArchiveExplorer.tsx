"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  archiveItems,
  archivePeriods,
  archiveSuggestions,
  archiveTypeLabel,
  archiveTypes,
  videoKindLabel,
  type ArchiveItem,
  type ArchiveType,
} from "@/data/archive";
import { speechItems } from "@/data/speeches";
import { moments, stageById } from "@/data/person";
import { normalizeArabic } from "@/data/search";
import { ui } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { CloseIcon, DownloadIcon, SearchIcon } from "@/components/ui/Icons";
import { Ornament } from "@/components/ui/Ornament";
import { SpeechList } from "@/components/speeches/SpeechList";

const footprint: Record<string, string> = {
  lg: "lg:col-span-6 lg:row-span-2",
  wide: "lg:col-span-6",
  tall: "lg:col-span-3 lg:row-span-2 md:row-span-2",
  md: "lg:col-span-4",
  sm: "lg:col-span-3",
};

const controlClass =
  "inline-flex h-9 items-center gap-2 border px-3 text-[0.68rem] tracking-[0.08em] transition-colors";

/** محطّات كل مرحلة، مجموعة تحت معرّفها — «حرب تموز 2006» تُذكر هنا لا في العنوان. */
const stageMoments = moments.reduce<Record<string, string>>((acc, moment) => {
  acc[moment.stageId] = `${acc[moment.stageId] ?? ""} ${moment.label} ${moment.date ?? moment.year}`;
  return acc;
}, {});

/**
 * كل ما يمكن البحث فيه داخل المادّة الواحدة: عنوان المرحلة وفترتها ومحطّاتها
 * ونوع المادّة وسنتها. يُبنى مرّة واحدة، ومُطبَّع عربيًّا حتى تطابق
 * «حرب غزّة» و«حرب غزة».
 */
const haystacks = new Map(
  archiveItems.map((item) => {
    const stage = stageById(item.stageId);
    const text = [
      stage?.title,
      stage?.period,
      stageMoments[item.stageId],
      archiveTypeLabel(item.type),
      item.kind ? videoKindLabel[item.kind] : "",
      item.year,
    ]
      .filter(Boolean)
      .join(" ");
    return [item.id, normalizeArabic(text)] as const;
  }),
);

/** رقاقة واحدة — هيئة واحدة للمحتوى والتاريخ معًا، والمختار يمتلئ ذهبًا. */
function Chip({
  active,
  onClick,
  numeric,
  children,
}: {
  active: boolean;
  onClick: () => void;
  numeric?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 shrink-0 rounded-ui border px-4 text-[0.72rem] tracking-[0.1em] transition-colors duration-300",
        numeric && "tabular-nums",
        active ? "border-gold bg-gold text-night" : "border-cream/15 text-cream/75 hover:border-gold hover:text-gold",
      )}
    >
      {children}
    </button>
  );
}

/** سطر تصفية: عنوانه مثبّت في أوّله، ورقائقه تجري أفقيًّا ولا تنكسر. */
function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:gap-5 md:px-5">
      <p className="eyebrow tracking-sep shrink-0 text-gold sm:w-20">{label}</p>
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar">{children}</div>
    </div>
  );
}

/** Downloads the asset once it exists; until then it says so plainly. */
function DownloadControl({ item }: { item: ArchiveItem }) {
  if (item.src) {
    return (
      <a href={item.src} download className={cn(controlClass, "border-gold/70 text-gold hover:bg-gold hover:text-night")}>
        <DownloadIcon className="h-3.5 w-3.5" />
        {ui.download}
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      title={ui.downloadPending}
      className={cn(controlClass, "cursor-not-allowed border-cream/20 text-cream/40")}
    >
      <DownloadIcon className="h-3.5 w-3.5" />
      {ui.download}
    </button>
  );
}

/** Filters run on local mock data; the UI is what matters here. */
export function ArchiveExplorer() {
  const params = useSearchParams();
  const initialType = (params.get("type") as ArchiveType | null) ?? "all";
  const [type, setType] = useState<ArchiveType | "all">(archiveTypes.some((t) => t.id === initialType) ? initialType : "all");
  const [period, setPeriod] = useState("all");
  const [query, setQuery] = useState("");
  const [hintsOpen, setHintsOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* the hint sheet closes on a click anywhere else, or on Escape */
  useEffect(() => {
    if (!hintsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setHintsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHintsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [hintsOpen]);

  const items = useMemo(() => {
    const p = archivePeriods.find((x) => x.id === period);
    const tokens = normalizeArabic(query).split(" ").filter(Boolean);
    return archiveItems.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      if (p?.from !== undefined && (item.year === undefined || item.year < p.from || item.year > (p.to ?? 9999))) return false;
      if (tokens.length) {
        const hay = haystacks.get(item.id) ?? "";
        if (!tokens.every((token) => hay.includes(token))) return false;
      }
      return true;
    });
  }, [type, period, query]);

  /* «خطابات» keeps its own presentation — the list from «/speeches», unchanged */
  const speeches = useMemo(() => {
    if (type !== "speech") return [];
    const kept = new Set(items.map((i) => i.id));
    return speechItems.filter((s) => kept.has(s.id));
  }, [type, items]);

  const key = items.map((i) => i.id).join("|");
  const filtered = type !== "all" || period !== "all" || query.trim() !== "";

  useGSAP(
    () => {
      const cells = gridRef.current?.querySelectorAll("[data-cell]");
      if (!cells?.length || prefersReducedMotion()) return;
      gsap.fromTo(cells, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: "power3.out", overwrite: true });
    },
    { dependencies: [key], scope: gridRef },
  );

  const reset = () => {
    setType("all");
    setPeriod("all");
    setQuery("");
  };

  const isSpeech = type === "speech";

  return (
    <div className="bg-blue">
      {/* شريط الأدوات: البحث والمجموعتان في حاوية واحدة */}
      <div className="sticky top-16 z-30 border-b border-cream/10 bg-blue/95 backdrop-blur-md md:top-[72px]">
        <div className="px-gutter py-4 md:py-5">
          <div className="rounded-ui border border-cream/12 bg-blue-dark/40">
            {/* البحث — أعلى الحاوية، لا معلّقًا تحتها */}
            <div ref={searchRef} className="relative border-b border-cream/10">
              <label className="flex h-12 items-center gap-3 px-4 transition-colors focus-within:bg-blue-dark/60 md:h-14 md:px-5">
                <SearchIcon className="h-4 w-4 shrink-0 text-blue-54" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setHintsOpen(true)}
                  onClick={() => setHintsOpen(true)}
                  placeholder="ابحث في الأرشيف…"
                  className="no-focus-ring min-w-0 flex-1 bg-transparent text-[0.9rem] text-cream placeholder:text-blue-54 focus:outline-none"
                  aria-label="بحث في الأرشيف"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={hintsOpen}
                  aria-controls="archive-hints"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="مسح البحث"
                    className="shrink-0 text-blue-54 transition-colors hover:text-gold"
                  >
                    <CloseIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>

              {hintsOpen && (
                <div
                  id="archive-hints"
                  className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 rounded-ui border border-cream/15 bg-blue-dark p-5 shadow-lift-dark"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[0.85rem] leading-[1.8] text-cream/85">اسأل عن موضوع من مواد الأرشيف — مثلاً:</p>
                    <button
                      type="button"
                      onClick={() => setHintsOpen(false)}
                      aria-label={ui.close}
                      className="shrink-0 text-blue-54 transition-colors hover:text-gold"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {archiveSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        /* keep the focus in the field so the sheet does not close first */
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setQuery(sug);
                          setHintsOpen(false);
                        }}
                        className="rounded-ui border border-cream/15 px-3 py-2 text-[0.72rem] text-cream/80 transition-colors hover:border-gold hover:text-gold"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                  <p className="mt-5 border-t border-cream/10 pt-4 text-[0.68rem] leading-[1.7] text-blue-54">
                    الاقتراحات مأخوذة من مراحل السيرة ومحطّاتها، وتُصفّى مع التاريخ والمحتوى المختارَين.
                  </p>
                </div>
              )}
            </div>

            {/* المجموعتان: عنوان يثبت في أوّل السطر، والرقائق تجري بجانبه */}
            <FilterRow label="المحتوى">
              {archiveTypes.map((t) => (
                <Chip key={t.id} active={type === t.id} onClick={() => setType(t.id)}>
                  {t.label}
                </Chip>
              ))}
            </FilterRow>

            <div className="border-t border-cream/10" />

            <FilterRow label="التاريخ">
              {archivePeriods.map((p) => (
                <Chip key={p.id} active={period === p.id} onClick={() => setPeriod(p.id)} numeric>
                  {p.label}
                </Chip>
              ))}
            </FilterRow>
          </div>
        </div>
      </div>

      <div className={cn("py-12 md:py-16", !isSpeech && "px-gutter")}>
        <p className={cn("eyebrow mb-8 tabular-nums", isSpeech && "px-gutter")} aria-live="polite">
          {isSpeech ? `${items.length} خطاباً` : `${items.length} عنصر`}
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-32 text-center">
            <Ornament unit="rose" variant="outline" className="w-14 text-blue-54" />
            <p className="text-heading text-[1.3rem] text-cream">لا توجد عناصر تطابق هذا الاختيار</p>
            <button
              type="button"
              onClick={reset}
              className="h-11 border border-gold px-5 text-[0.75rem] tracking-[0.1em] text-gold transition-colors hover:bg-gold hover:text-night"
            >
              إعادة الضبط
            </button>
          </div>
        ) : isSpeech ? (
          <SpeechList items={speeches} />
        ) : (
          <>
            <div
              ref={gridRef}
              className="grid grid-flow-dense grid-cols-2 auto-rows-[44vw] gap-4 md:auto-rows-[220px] md:grid-cols-6 lg:auto-rows-[240px] lg:grid-cols-12 lg:gap-6"
            >
              {items.map((item) => {
                const stage = stageById(item.stageId);
                return (
                  <article key={item.id} id={item.id} data-cell className={cn("group relative overflow-hidden md:col-span-3", footprint[item.size])}>
                    <MediaFrame media={item.media} fill tone="dark" interactive showLabel={false} unitSize={item.size === "lg" ? "lg" : "md"} />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-night/95 to-transparent p-4 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:p-5">
                      <div className="pointer-events-auto flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[0.9rem] text-cream">
                            <Slot value={item.title} className="text-cream" />
                          </p>
                          {stage && <p className="mt-1 truncate text-[0.68rem] text-blue-32">{stage.title}</p>}
                        </div>
                        <DownloadControl item={item} />
                      </div>
                    </div>

                    <p className="absolute top-4 start-4 flex items-center gap-2 text-[0.62rem] tracking-[0.1em] text-cream/80">
                      <Ornament unit="star" className="w-2.5 text-gold" />
                      {item.kind ? videoKindLabel[item.kind] : archiveTypeLabel(item.type)}
                    </p>
                  </article>
                );
              })}
            </div>

            {filtered && (
              <button
                type="button"
                onClick={reset}
                className="mt-12 h-11 border border-cream/20 px-5 text-[0.72rem] tracking-[0.1em] text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                إعادة الضبط
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
