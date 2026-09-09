import { cn } from "@/lib/utils";

type IconProps = { className?: string; strokeWidth?: number };

const base = "shrink-0";

/** Points "forward" in RTL (to the left). */
export function ArrowIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12H4" />
      <path d="M10 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowBackIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowDownIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v16" />
      <path d="M6 14l6 6 6-6" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" aria-hidden="true">
      <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
    </svg>
  );
}

export function CloseIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SearchIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function MenuIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <path d="M4 8h16M4 16h10" />
    </svg>
  );
}

export function SendIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

export function PlusIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ChevronIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function DownloadIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11" />
      <path d="M7.5 10.5L12 15l4.5-4.5" />
      <path d="M5 19h14" />
    </svg>
  );
}

export function SoundIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6L8 10z" />
      <path d="M16 9a4 4 0 010 6" />
    </svg>
  );
}

export function PhoneIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5L17 13l4 1.5v3a2.5 2.5 0 01-2.7 2.5A16.5 16.5 0 013.5 5.7 2.5 2.5 0 016 3z" />
    </svg>
  );
}

export function UploadIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V8" />
      <path d="M7.5 12.5L12 8l4.5 4.5" />
      <path d="M5 5h14" />
    </svg>
  );
}

/* — منصّات التواصل — the marks are drawn filled, as the platforms require */

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.7v8h3.3z" />
    </svg>
  );
}

export function InstagramIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" aria-hidden="true">
      <path d="M17.2 3h3.3l-7.2 8.2L21.7 21h-6.6l-4.3-5.6L5.8 21H2.5l7.7-8.8L2.6 3h6.7l3.9 5.2L17.2 3zm-1.2 16h1.8L8.1 4.9H6.2L16 19z" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" aria-hidden="true">
      <path d="M22.2 8.1a2.7 2.7 0 00-1.9-1.9C18.6 5.7 12 5.7 12 5.7s-6.6 0-8.3.5A2.7 2.7 0 001.8 8.1 28 28 0 001.3 12c0 1.3.15 2.6.5 3.9a2.7 2.7 0 001.9 1.9c1.7.5 8.3.5 8.3.5s6.6 0 8.3-.5a2.7 2.7 0 001.9-1.9c.35-1.3.5-2.6.5-3.9s-.15-2.6-.5-3.9zM9.9 15.1V8.9l5.4 3.1-5.4 3.1z" />
    </svg>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" aria-hidden="true">
      <path d="M21.6 4.3L18.4 19c-.25 1.05-.9 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.35-5 9.1-8.2c.4-.35-.1-.55-.6-.2L5.8 12.6.95 11.1c-1.05-.35-1.05-1.05.2-1.55l19.1-7.4c.85-.3 1.6.2 1.35 2.15z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2a9.7 9.7 0 00-8.35 14.6L2.2 21.8l5.15-1.35A9.7 9.7 0 1012 2.2zm0 1.75a7.95 7.95 0 016.75 12.15l-.25.4.85 3.05-3.15-.8-.35.2A7.95 7.95 0 1112 3.95zm-3.6 3.9c-.2 0-.5.05-.75.35-.25.3-.95.95-.95 2.3s.95 2.65 1.1 2.85c.15.2 1.9 3.05 4.7 4.15 2.35.9 2.8.75 3.3.7.5-.05 1.6-.65 1.85-1.3.2-.65.2-1.2.15-1.3-.05-.1-.2-.2-.45-.3-.25-.15-1.6-.8-1.85-.9-.25-.1-.4-.15-.6.15-.2.3-.7.85-.85 1.05-.15.2-.3.2-.55.05-.25-.1-1.15-.4-2.15-1.35-.8-.7-1.35-1.6-1.5-1.85-.15-.25 0-.4.1-.5l.4-.5c.15-.15.2-.3.3-.45.1-.2.05-.35 0-.5-.05-.1-.6-1.45-.8-1.95-.2-.5-.4-.45-.6-.45h-.5z" />
    </svg>
  );
}
