import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpeechList } from "@/components/speeches/SpeechList";

export const metadata: Metadata = { title: "خطابات" };

export default function SpeechesPage() {
  return (
    <>
      <PageHeader
        eyebrow="الأرشيف"
        title="خطابات"
        description="بعضٌ من خطاباته التي طلّ بها على التلفاز و في المباشر"
      />
      <SpeechList />
    </>
  );
}
