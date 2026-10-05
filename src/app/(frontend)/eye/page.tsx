import type { Metadata } from "next";
import { getArticles, getPageIntros } from "@/lib/content/queries";
import { SpiderWeb } from "@/components/eye/SpiderWeb";
import { EyeIndex } from "@/components/eye/EyeIndex";

export const metadata: Metadata = { title: "عين" };

export default async function EyePage() {
  const [articles, intros] = await Promise.all([getArticles(), getPageIntros()]);
  return (
    <>
      <SpiderWeb lead={intros.eye} />
      <EyeIndex articles={articles} />
    </>
  );
}
