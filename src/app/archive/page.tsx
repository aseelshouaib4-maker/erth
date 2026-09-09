import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArchiveExplorer } from "@/components/archive/ArchiveExplorer";

export const metadata: Metadata = { title: "أرشيف" };

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        eyebrow="المجموعة"
        title="أرشيف"
        index="02"
        unit="rose"
        description="صور وفيديوهات ونصوص وخطابات، مع تصفية بحسب المحتوى والتاريخ وبحث داخل مراحل السيرة."
      />
      <Suspense fallback={<div className="min-h-[60vh] bg-blue" />}>
        <ArchiveExplorer />
      </Suspense>
    </>
  );
}
