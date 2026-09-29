import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = { title: "المعرض" };

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="المعرض" title="صور من مراحل السيرة" />
      <GalleryGrid />
    </>
  );
}
