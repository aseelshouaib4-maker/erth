"use server";

import { searchSite } from "@/lib/content/search";
import type { SearchHit } from "@/lib/content/types";

const MAX_QUERY_LENGTH = 100;

export async function searchAction(query: unknown): Promise<SearchHit[]> {
  if (typeof query !== "string") return [];
  return searchSite(query.slice(0, MAX_QUERY_LENGTH));
}
