import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { brand } from "@/data/site";
import { person } from "@/data/person";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageCurtain } from "@/components/layout/PageCurtain";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { ScrollRefresher } from "@/components/layout/ScrollRefresher";
import { SiteSearch } from "@/components/search/SiteSearch";
import { AssistantModal } from "@/components/chat/AssistantModal";

/* الخط الوظيفي — المتن والبيانات */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

/* الخط الأساسي — العناوين */
const lifta = localFont({
  src: [
    { path: "../fonts/Liftaswashfixed-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Lifta-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-lifta",
  display: "swap",
});

/* الخط المساند — العناوين الفرعية */
const alQabas = localFont({
  src: [
    { path: "../fonts/alqabas-light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Al Qabas Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Al Qabas Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-alqabas",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${person.storyTitle}`,
    template: `%s — ${brand.name}`,
  },
  description: `${brand.tagline} · تجربة رقمية تفاعلية لسيرة ${person.name}`,
};

export const viewport: Viewport = {
  themeColor: "#004C60",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${lifta.variable} ${alQabas.variable}`}>
      <body>
        <Providers>
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          <main>{children}</main>
          <SiteChrome>
            <Footer />
            <SiteSearch />
            <AssistantModal />
            <PageCurtain />
            <SiteLoader />
          </SiteChrome>
          <ScrollRefresher />
        </Providers>
      </body>
    </html>
  );
}
