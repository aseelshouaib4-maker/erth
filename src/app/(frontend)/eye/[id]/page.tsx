import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { eyeCopy } from "@/data/eye";
import { getArticle, getArticles } from "@/lib/content/queries";
import { isSlot } from "@/lib/placeholder";
import { ArticleView } from "@/components/eye/ArticleView";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await getArticle(id);
  const title = found && !isSlot(found.article.title) ? found.article.title : eyeCopy.title;
  const description = found && !isSlot(found.article.excerpt) ? found.article.excerpt : undefined;
  return { title, description };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const [found, articles] = await Promise.all([getArticle(id), getArticles()]);
  if (!found) notFound();
  const index = Math.max(0, articles.findIndex((article) => article.id === id));
  const body = found.body ? <RichText data={found.body as SerializedEditorState} disableContainer /> : null;
  return <ArticleView item={found.article} index={index} body={body} />;
}
