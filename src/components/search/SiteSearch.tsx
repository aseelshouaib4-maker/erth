"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { searchSite } from "@/data/search";
import { ui } from "@/data/site";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { ArrowIcon, CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { Ornament } from "@/components/ui/Ornament";
import { useUI } from "@/components/layout/Providers";
import { TransitionLink } from "@/components/layout/TransitionLink";

const SUGGESTIONS = ["النجف", "بعلبك", "1992", "الأرشيف", "دار النشر"];

/** Plain search over the site's own words — separate from the assistant. */
export function SiteSearch() {
  const { searchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo(() => searchSite(query), [query]);
  const asked = query.trim().length > 0;

  useEffect(() => {
    if (!searchOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [searchOpen]);

  return (
    <Modal open={searchOpen} onClose={closeSearch} label={ui.searchTitle} className="h-[88dvh] md:h-[min(720px,86vh)]">
      <div className="flex h-full flex-col border border-cream/10 bg-blue-dark text-cream shadow-[0_40px_120px_-20px_rgba(2,42,54,0.9)]">
        <header className="shrink-0 border-b border-cream/10 px-5 py-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow tracking-sep">{ui.searchTitle}</p>
            <button
              type="button"
              onClick={closeSearch}
              className="inline-flex h-10 w-10 items-center justify-center border border-cream/15 text-cream transition-colors hover:border-gold hover:text-gold"
              aria-label={ui.close}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 border-b border-cream/20 transition-colors focus-within:border-gold">
            <SearchIcon className="h-5 w-5 shrink-0 text-blue-54" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              aria-label={ui.searchPlaceholder}
              className="h-14 min-w-0 flex-1 bg-transparent text-[1.05rem] text-cream placeholder:text-blue-54 focus:outline-none"
              autoComplete="off"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-[0.7rem] tracking-[0.1em] text-blue-54 transition-colors hover:text-gold">
                مسح
              </button>
            )}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 py-6 md:px-8">
          {!asked ? (
            <div className="flex flex-col items-center gap-6 py-14 text-center">
              <Ornament unit="rose" variant="outline" className="w-12 text-blue-54" />
              <p className="max-w-sm text-[0.9rem] leading-[1.9] text-blue-32">{ui.searchHint}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="h-9 border border-cream/15 px-4 text-[0.75rem] text-cream/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : hits.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-16 text-center">
              <Ornament unit="star" variant="outline" className="w-12 text-blue-54" />
              <p className="text-heading text-[1.15rem] text-cream">لا نتائج مطابقة</p>
              <p className="max-w-sm text-[0.85rem] leading-[1.9] text-blue-54">{ui.searchEmpty}</p>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-4 tabular-nums" aria-live="polite">
                {hits.length} نتيجة
              </p>
              <ol className="space-y-1">
                {hits.map((hit, i) => (
                  <li key={hit.id}>
                    <TransitionLink
                      href={hit.href}
                      onClick={closeSearch}
                      className={cn(
                        "group grid grid-cols-[2.25rem_1fr_auto] items-start gap-4 border-t border-cream/10 py-4 transition-colors",
                        "hover:bg-cream/5",
                      )}
                    >
                      <span className="eyebrow tabular-nums text-blue-54">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="text-heading block text-[1.02rem] text-cream transition-colors group-hover:text-gold">
                          {hit.title}
                        </span>
                        <span className="mt-1 block text-[0.66rem] tracking-[0.1em] text-gold/80">{hit.kind}</span>
                        {hit.snippet && (
                          <span className="mt-2 block line-clamp-2 text-[0.82rem] leading-[1.8] text-blue-32">{hit.snippet}</span>
                        )}
                      </span>
                      <ArrowIcon className="mt-1 h-4 w-4 shrink-0 text-blue-54 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100" />
                    </TransitionLink>
                  </li>
                ))}
                <li className="border-t border-cream/10" />
              </ol>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
