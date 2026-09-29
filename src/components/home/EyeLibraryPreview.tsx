"use client";

import { eyeItems } from "@/data/eye";
import { libraryItems } from "@/data/library";
import { ui } from "@/data/site";
import { useReveal } from "@/hooks/useReveal";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { Ornament } from "@/components/ui/Ornament";

const articles = eyeItems.slice(0, 3);
const books = libraryItems.slice(0, 4);

/** the two columns share this head, so their titles and buttons sit on one line */
function ColumnHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-reveal className="flex items-center gap-5">
      <Ornament unit="rose" variant="outline" className="w-12 shrink-0 text-kraft" />
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="text-display mt-1 text-[clamp(2rem,4vw,3rem)] leading-none text-blue">{title}</h2>
      </div>
    </div>
  );
}

/** Two doors on one band of archive paper: «عين» for writing about him, «دار النشر» for the volumes. */
export function EyeLibraryPreview() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative bg-paper">
      <div className="px-gutter grid items-stretch gap-16 py-24 md:py-32 lg:grid-cols-2 lg:gap-20">
        {/* عين */}
        <div className="flex flex-col lg:border-e lg:border-ink/15 lg:pe-16">
          <ColumnHead eyebrow="مقالات" title="عين" />

          <ol className="mt-10">
            {articles.map((item, i) => (
              <li key={item.id} data-reveal>
                <TransitionLink href={`/eye/${item.id}`} className="group flex items-baseline gap-4 border-t border-ink/15 py-4">
                  <span className="eyebrow w-7 tabular-nums text-ink/65">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.95rem] text-ink transition-colors group-hover:text-blue">
                      <Slot value={item.title} className="text-ink/70" />
                    </span>
                    <span className="mt-1 block text-[0.65rem] tracking-[0.1em] text-ink/65">
                      <Slot value={item.date} className="text-ink/65" />
                    </span>
                  </span>
                </TransitionLink>
              </li>
            ))}
            <li className="border-t border-ink/15" />
          </ol>

          <div data-reveal className="mt-auto pt-10">
            <Button href="/eye" variant="paper" size="sm" arrow>
              {ui.viewAll}
            </Button>
          </div>
        </div>

        {/* دار النشر */}
        <div className="flex flex-col">
          <ColumnHead eyebrow="المؤلفات" title="دار النشر" />

          <div className="mt-10 grid grid-cols-4 gap-4">
            {books.map((book) => (
              <TransitionLink key={book.id} href="/library" data-reveal className="group block">
                <MediaFrame media={book.media} ratio={3 / 4} tone="paper" unitSize="sm" showLabel={false} interactive />
                <p className="mt-2 truncate text-[0.7rem] text-ink/70 transition-colors group-hover:text-blue">
                  <Slot value={book.title} className="text-ink/60" />
                </p>
              </TransitionLink>
            ))}
          </div>

          <div data-reveal className="mt-auto pt-10">
            <Button href="/library" variant="paper" size="sm" arrow>
              {ui.viewAll}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
