import type { Metadata } from "next";
import { libraryCopy } from "@/data/library";
import { getBooks, getPageIntros } from "@/lib/content/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { LibraryShelf } from "@/components/library/LibraryShelf";
import { Slot } from "@/components/ui/Placeholders";

export const metadata: Metadata = { title: "دار النشر" };

export default async function LibraryPage() {
  const [books, intros] = await Promise.all([getBooks(), getPageIntros()]);
  return (
    <>
      <PageHeader eyebrow={libraryCopy.eyebrow} title={libraryCopy.title} rule={false}>
        <p className="max-w-xl text-[0.95rem] leading-[1.9] text-blue-32">
          <Slot value={intros.library} />
        </p>
      </PageHeader>
      <LibraryShelf items={books} />
    </>
  );
}
