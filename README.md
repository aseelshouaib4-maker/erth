# حفظ الإرث — واجهة تجربة وثائقية تفاعلية

Frontend-only Next.js (App Router) experience for the documentary site about **حسن نصر الله**,
built to the second style of the visual identity guide («الأسلوب الثاني: المرئيات والزخارف»).
Arabic, RTL, blue ground, gold as a point of light, ornament grid, GSAP + ScrollTrigger.

No backend, CMS, API or AI logic is included. Everything that would come from a server lives in
`src/data/*` as typed mock data so it can be swapped for a real source later.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` produces the production bundle; `npm run lint` runs ESLint.

## Stack

Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS v4, GSAP 3.15 (ScrollTrigger, SplitText) via `@gsap/react`.

## Routes

| Route | Nav label | Contents |
| --- | --- | --- |
| `/` | — (wordmark) | hero quote slider, حاور الأرشيف, خطابات, صور من الأرشيف, فيديوهات, عين + المكتبة, من نحن |
| `/biography` | سيرة | the long biography — ten stages, one photographic plate each |
| `/archive` | أرشيف | صور · فيديوهات · نصوص, filterable by period, each item downloadable |
| `/speeches` | الخطابات | خطابات only, video-led |
| `/eye` | عين | articles, behind the collapsing spider web |
| `/eye/[id]` | — | one article: title, date, byline, description and body |
| `/library` | المكتبة | مؤلفاته and عنه |
| `/contact` | تواصل | email, the way to تطوّع, and a visual-only form (archive paper ground) |
| `/volunteer` | — | استمارة طلب تطوّع (linked from the footer and from تواصل) |
| `/story` | — | the scroll-driven story chapters (reachable from the assistant) |
| `/gallery` | — | the full photo wall (reachable from the assistant) |

## Fonts

The licensed brand faces are committed in `src/fonts` and self-hosted through `next/font/local`
(wired in `src/app/layout.tsx`):

| Role | Family | Files |
| --- | --- | --- |
| العناوين الرئيسية | **Lifta Swash** | `Liftaswashfixed-Regular.otf` (400), `Lifta-Black.otf` (900) |
| العناوين الفرعية | **Al Qabas** | `alqabas-light.ttf` (300), `Al Qabas Regular.ttf` (400), `Al Qabas Bold.ttf` (700) |
| المتن والبيانات | **Cairo** | Google Fonts, via `next/font/google` |

`text-display` uses Lifta Black, `text-swash` uses the swash cut at 400, `text-heading` uses Al Qabas.

## Content rules

- Only client-provided text is used: the ten biography stages (`src/data/person.ts`, verbatim from
  «مراحل_السيرة_محايدة.md»), the «من نحن» text (`src/data/about.ts`, verbatim), the hero quote from the
  2016 student meeting (`src/data/quotes.ts`), the volunteer form and the specialities list
  (`src/data/volunteer.ts`, verbatim from the two Word documents) and the brand wordmark from the guide.
- Everything else is a **slot**: `slot("…")` renders as a dashed `[label]` (see `Slot`, `ParagraphSlot`),
  and `media("image" | "video" | "audio" | "document", label)` renders as a `MediaFrame` tile.
- The only real photograph is `public/images/character.jpg` (used by `<Portrait />` inside the story overlay).

## Design system

- Tokens live in `src/app/globals.css` under `@theme`: blue `#004C60` (ground), blue scale, gold `#C99700`,
  cream `#F6F4EF`, night `#022A36`, plus the archive paper set `#EDE5D6` / `#DCD3C0` / `#C8BBA1` / `#1B1916`.
- Three bands use the paper ground instead of the blue one: «صور من الأرشيف» and «عين + المكتبة» on the
  homepage, and the whole of `/contact`. `PageHeader` takes `tone="paper"`, `MediaFrame` takes `tone="paper"`,
  and `Button` takes `variant="paper"`.
- Type rules from the guide: headings line-height 1.2, body 1.9; labels tracking 0.10em, separators 0.22em.
- Two ornament units are in use — الوردة الرباعية and النجمة الثمانية (`src/components/ui/ornaments.ts`).
  `<Ornament />` draws one, `<OrnamentGrid />` lays the 4 × 4 tile with the guide's rules (square unit,
  1×/2×/4× only, graded density via `fade`, never rotated).

## Navigation rules

`src/components/layout/TransitionLink.tsx` is the single place these live:

- **A link to another route** plays the curtain, then `router.push` — Next lands at the top of the destination.
- **A link to the page you are already on** never adds a history entry. Without a hash it glides back to the
  top; with one it glides to that section and rewrites the hash in place.
- **Browser back and forward** are untouched, so Next restores the scroll position the visitor left. `html`
  keeps `scroll-behavior: auto` for exactly this reason — every deliberate glide asks for `smooth` itself.
- **Leaving a detail page** (for example an article) uses `router.back()`, which returns the reader to their
  place in the index rather than to the top.

## Search and the assistant

Two separate things sit side by side in the navbar:

- **بحث في الموقع** (the magnifier) opens `SiteSearch`, a plain search over the site's own words —
  sections, the ten biography stages and their text, the key dates, and «من نحن». `src/data/search.ts`
  builds the index and normalises Arabic (diacritics, alef and ya forms, ta marbuta) so queries actually match.
- **حاور الأرشيف** opens `AssistantModal`, laid out exactly like the band under the hero. Asking from that
  band opens the same modal with the question already sent. Answers are mock records shaped like the future
  API (`src/data/chat.ts`); `ChatPanel.ask()` is the one place to swap in the real call.

## «عين» — the web

`src/components/eye/SpiderWeb.tsx`. The orb web is generated from geometry at module scope, so the server and
the client render identical paths. It breathes on its anchors while three spiders crawl. On scroll the section
pins and a scrubbed timeline runs four beats: tremble, threads snapping along their own `stroke-dashoffset`,
the sheet sagging, then the whole thing falling away with the spiders. Reduced motion gets a still web.

## «تطوّع» — the volunteer form

`src/app/volunteer` and `src/components/volunteer/`. The seven sections, their fields and the pledge text come
verbatim from «استمارة طلب تطوّع». «الاختصاص العلمي الدقيق» is a suggest-and-pick field
(`SpecialtyPicker.tsx`) fed by the nine categories of «لائحة الاختصاصات العلميّة والمهنيّة المطلوبة للتطوّع»;
the visitor can pick several or type one that is not on the list, as the document says the list is advisory.

## Downloads in the archive

`ArchiveItem.src` is where the downloadable file path goes. While it is undefined the download control renders
in its waiting state with a tooltip; set `src` and it becomes a real `<a download>`.

## Motion

- `lib/gsap.ts` registers plugins once and exports `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP`, `MEDIA`.
- `useReveal()` reveals `[data-reveal]` descendants with `ScrollTrigger.batch`; elements start hidden through
  CSS only when scripting is enabled, so the page still reads without JS.
- Pinned/scrubbed sections: `SpiderWeb` and `Timeline` (desktop). Each uses `gsap.matchMedia()` so mobile and
  `prefers-reduced-motion` get simpler behaviour.
- SplitText is used with `type: "lines"` only — splitting Arabic into characters breaks letter joining.
- In development only, `lib/gsap.ts` runs a watchdog that ticks GSAP manually when `requestAnimationFrame`
  is suspended (hidden tabs, embedded preview panes). It is compiled out of production builds.

## Notes for the client

- The «من نحن» paragraph mentions «دار المودة» exactly as supplied; it was left untouched.
- Hero slides 2–4 hold quote placeholders until you send more quotes; slide 1 carries the 2016 one.
- `/biography` shows the short stage text plus a one-line slot for the long text. When the long biography
  arrives the pinned panel will need to become a scrolling article — flag it then.
- Contact and volunteer forms are visual only (no submission). The address is `erth@gmail.com`.
