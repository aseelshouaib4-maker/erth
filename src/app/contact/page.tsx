import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactSections } from "@/components/contact/ContactSections";

export const metadata: Metadata = { title: "تواصل" };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="تواصل" title="تواصل معنا" index="06" unit="rose" tone="paper" rule={false} />
      <ContactSections />
    </>
  );
}
