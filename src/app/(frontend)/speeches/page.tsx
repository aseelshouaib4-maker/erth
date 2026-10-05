import type { Metadata } from "next";
import { getSpeeches } from "@/lib/content/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpeechList } from "@/components/speeches/SpeechList";

export const metadata: Metadata = { title: "خطابات" };

export default async function SpeechesPage() {
  const speeches = await getSpeeches();
  return (
    <>
      <PageHeader
        eyebrow="الأرشيف"
        title="خطابات"
        description="بعضٌ من خطاباته التي طلّ بها على التلفاز و في المباشر"
      />
      <SpeechList items={speeches} />
    </>
  );
}
