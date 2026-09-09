import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eyeCopy, eyeItems } from "@/data/eye";
import { ArticleView } from "@/components/eye/ArticleView";

export function generateStaticParams() {
  return eyeItems.map((item) => ({ id: item.id }));
}

export const metadata: Metadata = { title: eyeCopy.title };

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = eyeItems.findIndex((item) => item.id === id);
  if (index === -1) notFound();
  return <ArticleView item={eyeItems[index]} index={index} />;
}
