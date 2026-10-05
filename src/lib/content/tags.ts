/**
 * Cache tags shared by the content queries (which attach them) and the CMS
 * hooks (which invalidate them). Kept free of server-only imports so both
 * sides can use it.
 */

/** Attached to every cached content query; uploads invalidate it because any page may show them. */
export const CONTENT_TAG = "content";

export const contentTag = (slug: string) => `content:${slug}`;
