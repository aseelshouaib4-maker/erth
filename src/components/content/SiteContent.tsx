"use client";

import { createContext, useContext, useMemo } from "react";
import type { SiteContent, Stage } from "@/lib/content/types";

type SiteContentValue = SiteContent & {
  stageById: (id: string | undefined) => Stage | undefined;
};

const SiteContentContext = createContext<SiteContentValue | null>(null);

/** Hands the content every page shares (person, settings, stages) to client components. */
export function SiteContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  const context = useMemo<SiteContentValue>(() => {
    const byId = new Map(value.stages.map((stage) => [stage.id, stage]));
    return { ...value, stageById: (id) => (id ? byId.get(id) : undefined) };
  }, [value]);
  return <SiteContentContext.Provider value={context}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent must be used inside <SiteContentProvider>");
  return context;
}
