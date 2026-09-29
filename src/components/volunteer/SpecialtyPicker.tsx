"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { specialtyGroups } from "@/data/volunteer";
import { cn } from "@/lib/utils";
import { CloseIcon, PlusIcon, SearchIcon } from "@/components/ui/Icons";

type Option = { value: string; group: string };

const allOptions: Option[] = specialtyGroups.flatMap((g) => g.items.map((value) => ({ value, group: g.title })));

/**
 * «الاختصاص العلمي الدقيق» — suggests from the institution's published list and
 * lets the visitor pick several. Free text is allowed, since the list is
 * explicitly advisory rather than exhaustive.
 */
export function SpecialtyPicker({ name = "specialties" }: { name?: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim();
    const pool = allOptions.filter((o) => !selected.includes(o.value));
    if (!q) return pool;
    return pool.filter((o) => o.value.includes(q) || o.group.includes(q));
  }, [query, selected]);

  const grouped = useMemo(() => {
    const map = new Map<string, string[]>();
    matches.forEach((o) => {
      const list = map.get(o.group) ?? [];
      list.push(o.value);
      map.set(o.group, list);
    });
    return Array.from(map.entries());
  }, [matches]);

  // a new query starts the highlight over; adjusting during render avoids an extra pass
  const [lastQuery, setLastQuery] = useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setCursor(0);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /** options and the add button suppress mousedown, so focus never leaves the input */
  const add = (value: string) => {
    const v = value.trim();
    if (!v || selected.includes(v)) return;
    setSelected((s) => [...s, v]);
    setQuery("");
  };
  const remove = (value: string) => setSelected((s) => s.filter((v) => v !== value));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setCursor((c) => Math.min(c + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && matches[cursor]) add(matches[cursor].value);
      else if (query.trim()) add(query);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && !query && selected.length) {
      remove(selected[selected.length - 1]);
    }
  };

  let runningIndex = -1;

  return (
    <div ref={rootRef} className="relative">
      {/* the picked specialities travel with the form */}
      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}

      {selected.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {selected.map((value) => (
            <li key={value}>
              <span className="inline-flex items-center gap-2 rounded-ui border border-gold/50 bg-gold/12 py-1.5 pe-2 ps-3 text-[0.75rem] text-ink">
                {value}
                <button
                  type="button"
                  onClick={() => remove(value)}
                  aria-label={`إزالة ${value}`}
                  className="inline-flex h-5 w-5 items-center justify-center text-gold transition-colors hover:text-ink"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="field flex items-center gap-3 py-0 ps-3">
        <SearchIcon className="h-4 w-4 shrink-0 text-ink/65" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="ابحث في لائحة الاختصاصات أو اكتب اختصاصك…"
          className="min-w-0 flex-1 bg-transparent py-3 text-[0.95rem] text-ink placeholder:text-ink/38 focus:outline-none"
          aria-label="الاختصاص العلمي الدقيق"
          aria-expanded={open}
          role="combobox"
          aria-controls="specialty-list"
          autoComplete="off"
        />
        {query.trim() && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => add(query)}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-ui border border-blue/60 px-3 text-[0.68rem] tracking-[0.08em] text-blue transition-colors hover:bg-blue hover:text-paper"
          >
            <PlusIcon className="h-3 w-3" />
            إضافة
          </button>
        )}
      </div>

      {open && (
        <div
          id="specialty-list"
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-ui border border-ink/15 bg-white/97 shadow-lift backdrop-blur-md"
        >
          {grouped.length === 0 ? (
            <p className="px-4 py-4 text-[0.8rem] text-ink/65">لا نتائج — يمكنك إضافة اختصاصك كما هو.</p>
          ) : (
            grouped.map(([group, values]) => (
              <div key={group}>
                <p className="eyebrow sticky top-0 bg-white/97 px-4 py-2 text-ink/65 backdrop-blur-md">{group}</p>
                <ul>
                  {values.map((value) => {
                    runningIndex += 1;
                    const active = runningIndex === cursor;
                    return (
                      <li key={value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onMouseEnter={() => setCursor(matches.findIndex((o) => o.value === value))}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => add(value)}
                          className={cn(
                            "block w-full px-4 py-2.5 text-start text-[0.85rem] leading-[1.6] transition-colors",
                            active ? "bg-blue/10 text-blue" : "text-ink/80 hover:bg-ink/5 hover:text-ink",
                          )}
                        >
                          {value}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
