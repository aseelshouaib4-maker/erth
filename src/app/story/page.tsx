import type { Metadata } from "next";
import { person } from "@/data/person";
import { PageHeader } from "@/components/ui/PageHeader";
import { StoryScroller } from "@/components/story/StoryScroller";

export const metadata: Metadata = { title: "القصة" };

export default function StoryPage() {
  return (
    <>
      <PageHeader eyebrow="القصة" title={person.storyTitle} description="عشرة فصول تتبدّل صورها ومحطاتها مع التمرير." />
      <StoryScroller />
    </>
  );
}
