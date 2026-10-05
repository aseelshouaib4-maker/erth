import { revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  RequestContext,
} from "payload";
import { CONTENT_TAG, contentTag } from "@/lib/content/tags";

/**
 * Scripts that run outside Next (seed, migrations) set this on the request
 * context: `revalidateTag` only works inside a Next request.
 */
export const DISABLE_REVALIDATE = "disableRevalidate";

/** Published edits must show on the next visit, not one visit later. */
const EXPIRE_NOW = { expire: 0 };

function revalidate(tag: string, context: RequestContext) {
  if (context[DISABLE_REVALIDATE]) return;
  revalidateTag(tag, EXPIRE_NOW);
}

/** Invalidates the pages that read this collection whenever a document changes or goes away. */
export function revalidateCollection(slug: string, { everything = false } = {}) {
  const tag = everything ? CONTENT_TAG : contentTag(slug);
  const afterChange: CollectionAfterChangeHook = ({ doc, req }) => {
    revalidate(tag, req.context);
    return doc;
  };
  const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    revalidate(tag, req.context);
    return doc;
  };
  return { afterChange: [afterChange], afterDelete: [afterDelete] };
}

export function revalidateGlobal(slug: string) {
  const afterChange: GlobalAfterChangeHook = ({ doc, req }) => {
    revalidate(contentTag(slug), req.context);
    return doc;
  };
  return { afterChange: [afterChange] };
}
