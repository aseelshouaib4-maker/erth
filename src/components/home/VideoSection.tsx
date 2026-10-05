"use client";

import { videoKindLabel } from "@/data/archive";
import { ui } from "@/data/site";
import { useReveal } from "@/hooks/useReveal";
import type { HomeVideo } from "@/lib/content/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Slot } from "@/components/ui/Placeholders";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

/** Videos from the archive: three pieces only, the rest live in «أرشيف». */
export function VideoSection({ videos }: { videos: HomeVideo[] }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="media" ref={ref} className="relative bg-blue-dark py-24 md:py-36">
      <div className="px-gutter">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="من الأرشيف" title="فيديوهات" size="lg" display />
          <div data-reveal>
            <Button href="/archive?type=video" variant="link" arrow>
              {ui.viewAll}
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {videos.map((item) => (
            <div key={item.id} data-reveal className="group">
              <VideoPlayer media={item.media} ratio={16 / 9} tone="blue" unitSize="md" sizes="(min-width: 768px) 33vw, 100vw" />
              <p className="mt-4 text-[1rem] leading-[1.6] text-cream/90 transition-colors group-hover:text-gold">
                <Slot value={item.title} />
              </p>
              <p className="mt-1 text-[0.65rem] tracking-[0.1em] text-blue-54">
                {item.kind ? `${videoKindLabel[item.kind]} · ` : ""}
                <Slot value={item.year} /> · <Slot value={item.duration} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
