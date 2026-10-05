import { notFound } from "next/navigation";

/**
 * The site and the admin panel have separate root layouts, so there is no
 * single root `not-found`. Any unmatched URL lands here and renders the
 * site's own 404 inside the site layout.
 */
export default function CatchAll() {
  notFound();
}
