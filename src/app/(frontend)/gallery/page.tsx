import type { Metadata } from "next";
import { getGallery } from "@/lib/content/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = { title: "المعرض" };

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHeader eyebrow="المعرض" title="صور من مراحل السيرة" />
      <GalleryGrid items={items} />
    </>
  );
}
