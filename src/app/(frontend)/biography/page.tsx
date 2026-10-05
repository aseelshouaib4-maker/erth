import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Timeline } from "@/components/biography/Timeline";

export const metadata: Metadata = { title: "السيرة" };

export default async function BiographyPage() {
  const { person } = await getSiteContent();
  return (
    <>
      <PageHeader eyebrow="السيرة" title={person.name} description={`${person.birth.date} — ${person.death.date}`} />
      <Timeline />
    </>
  );
}
