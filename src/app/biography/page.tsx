import type { Metadata } from "next";
import { person } from "@/data/person";
import { PageHeader } from "@/components/ui/PageHeader";
import { Timeline } from "@/components/biography/Timeline";

export const metadata: Metadata = { title: "السيرة" };

export default function BiographyPage() {
  return (
    <>
      <PageHeader eyebrow="السيرة" title={person.name} description={`${person.birth.date} — ${person.death.date}`} />
      <Timeline />
    </>
  );
}
