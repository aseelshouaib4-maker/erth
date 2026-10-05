import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-blue">
      <OrnamentGrid scale={2} fade="radial" opacity={0.07} />
      <div className="px-gutter relative flex flex-col items-center text-center">
        <Ornament unit="rose" variant="outline" className="w-16 text-gold" />
        <p className="eyebrow tracking-sep mt-8">404</p>
        <h1 className="text-display mt-4 text-[clamp(2.2rem,6vw,5rem)] text-cream">الصفحة غير موجودة</h1>
        <Button href="/" arrow className="mt-10">
          العودة إلى الرئيسية
        </Button>
      </div>
    </section>
  );
}
