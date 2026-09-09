"use client";

import { brand, contact, nav, socials, ui, type SocialId } from "@/data/site";
import { person } from "@/data/person";
import { Logo, Wordmark } from "@/components/ui/Brand";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { Button } from "@/components/ui/Button";
import {
  FacebookIcon,
  InstagramIcon,
  PhoneIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";
import { TransitionLink } from "./TransitionLink";

const socialIcon: Record<SocialId, (props: { className?: string }) => React.ReactElement> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
};

/**
 * One account, drawn as a bare mark — no box, no fill.
 * Until its link is filled in the mark is shown but stays dead.
 */
function SocialMark({ id, label, href }: { id: SocialId; label: string; href: string }) {
  const Icon = socialIcon[id];
  if (!href) {
    return (
      <span
        title={`${label} — ${ui.accountPending}`}
        aria-label={`${label} — ${ui.accountPending}`}
        className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center text-cream/20"
      >
        <Icon className="h-[1.15rem] w-[1.15rem]" />
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      title={label}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center text-blue-32 transition-colors duration-300 hover:text-gold"
    >
      <Icon className="h-[1.15rem] w-[1.15rem]" />
    </a>
  );
}

/** Gold section heading — the only thing that names a column. */
function ColumnHead({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow tracking-sep mb-6 text-gold">{children}</p>;
}

/**
 * The closing section of the archive: three columns in RTL —
 * the house, its sections, and how to reach it.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-night text-cream">
      {/* الوصلة: شريط زخرفي يخفّ إلى أسفل، فلا تنقطع الأرضيّة الفاتحة فجأة على الداكنة */}
      <div className="relative h-20 md:h-28" aria-hidden="true">
        <span className="absolute inset-x-0 top-0 h-px bg-gold/40" />
        <OrnamentGrid scale={1} fade="top" opacity={0.14} filled="var(--color-blue-70)" outline="var(--color-blue-70)" />
      </div>

      {/* النسيج الأرشيفي تحت المحتوى كلّه */}
      <OrnamentGrid scale={4} fade="edges" opacity={0.05} filled="var(--color-blue-70)" outline="var(--color-blue-70)" />

      <div className="px-gutter relative grid gap-14 pb-16 md:grid-cols-12 md:gap-10 md:pb-20">
        {/* الدار */}
        <div className="md:col-span-12 lg:col-span-4">
          <Logo height={64} className="text-gold" />
          <div className="mt-6 text-cream">
            <Wordmark height={36} />
          </div>
          <p className="eyebrow tracking-sep mt-4">{brand.tagline}</p>
          <p className="mt-6 max-w-xs text-[0.85rem] leading-[1.9] text-blue-32">{person.storyTitle}</p>
        </div>

        {/* الأقسام */}
        <nav className="md:col-span-5 lg:col-span-3" aria-label="أقسام الموقع">
          <ColumnHead>الأقسام</ColumnHead>
          <ul className="space-y-3.5">
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className="text-[0.95rem] text-blue-32 transition-colors duration-300 hover:text-gold"
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* التواصل والحسابات */}
        <div className="md:col-span-7 lg:col-span-5">
          <ColumnHead>{ui.callUs}</ColumnHead>

          <a
            href={`mailto:${contact.email}`}
            className="block text-[1rem] text-cream transition-colors duration-300 hover:text-gold"
          >
            {contact.email}
          </a>

          <div className="mt-4">
            {contact.phone ? (
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                dir="ltr"
                className="inline-flex items-center gap-3 text-[1rem] text-cream transition-colors duration-300 hover:text-gold"
              >
                <PhoneIcon className="h-4 w-4 text-gold" />
                <span className="tabular-nums">{contact.phone}</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-3 text-[0.85rem] text-blue-32">
                <PhoneIcon className="h-4 w-4 text-cream/25" />
                {ui.phonePending}
              </span>
            )}
          </div>

          <p className="eyebrow tracking-sep mt-10 mb-3 text-gold">{ui.follow}</p>
          <ul className="-ms-2 flex flex-wrap items-center gap-1">
            {socials.map((s) => (
              <li key={s.id}>
                <SocialMark {...s} />
              </li>
            ))}
          </ul>

          {/* الدعوتان، بعيدتان عن الروابط بمسافة واضحة */}
          <div className="mt-12 flex flex-wrap gap-4 border-t border-cream/10 pt-10">
            <Button href="/contact#volunteer" variant="outline" arrow>
              تطوّع معنا
            </Button>
            <Button href="/contact#contribute" variant="ghost" arrow>
              {ui.contribute}
            </Button>
          </div>
        </div>
      </div>

      {/* خيط رفيع فوق شريط الحقوق */}
      <div className="px-gutter relative">
        <span className="block h-px bg-cream/12" aria-hidden="true" />
      </div>

      <div className="px-gutter relative flex flex-col gap-2 py-6 text-[0.7rem] tracking-[0.1em] text-blue-32 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {brand.name} · {brand.houseName}
        </p>
        <p>
          {person.name} · {person.birth.year} — {person.death.year}
        </p>
      </div>
    </footer>
  );
}
