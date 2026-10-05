import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { StoryScroller } from "@/components/story/StoryScroller";

export const metadata: Metadata = { title: "القصة" };

/** 1, 2, 3–10 and 11+ each take their own form of the counted noun. */
const chapters = (n: number) => (n === 1 ? "فصل واحد" : n === 2 ? "فصلان" : n <= 10 ? `${n} فصول` : `${n} فصلًا`);

export default async function StoryPage() {
  const { person, stages } = await getSiteContent();
  return (
    <>
      <PageHeader
        eyebrow="القصة"
        title={person.storyTitle}
        description={`${chapters(stages.length)} تتبدّل صورها ومحطاتها مع التمرير.`}
      />
      <StoryScroller />
    </>
  );
}
