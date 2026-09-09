import type { Metadata } from "next";
import { volunteerCopy } from "@/data/volunteer";
import { PageHeader } from "@/components/ui/PageHeader";
import { VolunteerForm } from "@/components/volunteer/VolunteerForm";

export const metadata: Metadata = { title: "تطوّع" };

export default function VolunteerPage() {
  return (
    <>
      <PageHeader
        eyebrow={volunteerCopy.org}
        title={volunteerCopy.title}
        index="07"
        unit="rose"
        tone="paper"
        rule={false}
        description={volunteerCopy.lead}
      >
        <p className="eyebrow tracking-sep">{volunteerCopy.bismillah}</p>
      </PageHeader>
      <VolunteerForm />
    </>
  );
}
