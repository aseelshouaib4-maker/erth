import type { Metadata } from "next";
import { libraryCopy } from "@/data/library";
import { PageHeader } from "@/components/ui/PageHeader";
import { LibraryShelf } from "@/components/library/LibraryShelf";
import { Slot } from "@/components/ui/Placeholders";

export const metadata: Metadata = { title: "دار النشر" };

export default function LibraryPage() {
  return (
    <>
      <PageHeader eyebrow={libraryCopy.eyebrow} title={libraryCopy.title} rule={false}>
        <p className="max-w-xl text-[0.95rem] leading-[1.9] text-blue-32">
          <Slot value={libraryCopy.lead} />
        </p>
      </PageHeader>
      <LibraryShelf />
    </>
  );
}
