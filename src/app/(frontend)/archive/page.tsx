import type { Metadata } from "next";
import { Suspense } from "react";
import { getArchive, getMoments } from "@/lib/content/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArchiveExplorer } from "@/components/archive/ArchiveExplorer";

export const metadata: Metadata = { title: "أرشيف" };

export default async function ArchivePage() {
  const [{ items, speeches }, moments] = await Promise.all([getArchive(), getMoments()]);
  return (
    <>
      <PageHeader
        eyebrow="المجموعة"
        title="أرشيف"
        description="صور وفيديوهات ونصوص وخطابات، مع تصفية بحسب المحتوى والتاريخ وبحث داخل مراحل السيرة."
      />
      <Suspense fallback={<div className="min-h-[60vh] bg-blue" />}>
        <ArchiveExplorer items={items} speeches={speeches} moments={moments} />
      </Suspense>
    </>
  );
}
