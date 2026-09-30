"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

type Props = {
  paragraphs: readonly string[];
  /** classes of the wrapper that holds the paragraphs */
  className?: string;
  /** classes of each <p> — the typing never changes them */
  paragraphClassName?: string;
  /** let `useReveal` slide each paragraph in, as the rest of the section does */
  reveal?: boolean;
};

/* الإيقاع: سريع بما يكفي لنصّ طويل، ومتفاوت بما يكفي ليبدو بيدٍ لا بآلة */
const BASE = 17; // ms لكل حرف
const JITTER = 7; // ± ms
const PUNCT = 190; // وقفة بعد علامة الترقيم
const BREAK = 380; // وقفة قبل الفقرة التالية
const PUNCTUATION = new Set(["،", ",", ".", "؛", ":", "؟"]);

/** تفاوتٌ ثابت: الإيقاع نفسه في كل زيارة، ولا عشوائيّة داخل العرض */
function jitter(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return ((x - Math.floor(x)) * 2 - 1) * JITTER;
}

/**
 * فقرات تُكتب حرفاً حرفاً حين تدخل مدى النظر.
 *
 * العربية تتّصل حروفها، فلا يُلفّ كل حرف بعنصر مستقلّ — ذلك يفكّ الوصل
 * فيظهر كل حرف منفرداً. بدل ذلك يطول نصٌّ واحد، فتبقى الحروف موصولة في كل
 * لحظة كما تبدو الكتابة العربية فعلاً.
 *
 * ولا يتحرّك التخطيط: النصّ الكامل حاضرٌ مخفيّاً يحجز مكانه بالضبط، والنصّ
 * المكتوب يُرسم فوقه. قارئ الشاشة يقرأ الفقرة كاملة من البداية.
 */
export function TypedParagraphs({ paragraphs, className, paragraphClassName, reveal }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  /* نقاط رمزيّة لا وحدات UTF-16، حتى لا تنشطر علامة */
  const chars = useMemo(() => paragraphs.map((p) => Array.from(p)), [paragraphs]);
  const starts = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const cs of chars) {
      out.push(acc);
      acc += cs.length;
    }
    return out;
  }, [chars]);
  const total = starts.length ? starts[starts.length - 1] + chars[chars.length - 1].length : 0;

  /* متى يظهر كل حرف، بالمللي ثانية من لحظة البدء */
  const schedule = useMemo(() => {
    const times: number[] = [];
    let t = 0;
    let k = 0;
    chars.forEach((cs, pi) => {
      if (pi > 0) t += BREAK;
      for (const ch of cs) {
        t += BASE + jitter(k);
        times.push(t);
        k += 1;
        if (PUNCTUATION.has(ch)) t += PUNCT;
      }
    });
    return times;
  }, [chars]);

  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "done">("idle");
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !total) return;

    let t0 = 0;
    let i = 0;
    let started = false;
    let running = false;
    /* حاوية لا متغيّر: begin قد يُنادى قبل أن يُسند المشغّل */
    const handle: { trigger?: ReturnType<typeof ScrollTrigger.create> } = {};

    /* على نبض GSAP، متزامناً مع الإطارات؛ ويُحسب من الوقت المنقضي فلا يتباطأ إن تأخّر إطار */
    const tick = () => {
      const before = i;
      const elapsed = performance.now() - t0;
      while (i < total && schedule[i] <= elapsed) i += 1;
      if (i !== before) setCount(i);
      if (i >= total) {
        gsap.ticker.remove(tick);
        running = false;
        setPhase("done");
      }
    };

    const begin = () => {
      if (started) return;
      started = true;
      handle.trigger?.kill();
      if (prefersReducedMotion()) {
        setCount(total);
        setCaret(false);
        setPhase("done");
        return;
      }
      t0 = performance.now();
      setPhase("typing");
      running = true;
      gsap.ticker.add(tick);
    };

    /* كالبقيّة في الموقع: ScrollTrigger يحدّد الدخول. ومن يصل صاعداً من تحت
       (بعد إعادة تحميل الصفحة وهو أسفلها) يبدأ عنده أيضاً، فلا يبقى النصّ فارغاً */
    handle.trigger = ScrollTrigger.create({
      trigger: root,
      start: "top 78%",
      end: "bottom top",
      onEnter: begin,
      onEnterBack: begin,
    });
    /* إن نادى onEnter أثناء الإنشاء نفسه، فالمشغّل لم يكن قد وُجد ليُقتل */
    if (started) handle.trigger.kill();

    return () => {
      handle.trigger?.kill();
      if (running) gsap.ticker.remove(tick);
    };
  }, [schedule, total]);

  /* المؤشّر يتبع آخر حرفٍ كُتب؛ وقبل البدء ينتظر في أوّل الفقرة الأولى */
  let active = 0;
  for (let p = 0; p < starts.length; p += 1) if (starts[p] < count) active = p;

  return (
    <div ref={rootRef} className={className}>
      {chars.map((cs, pi) => {
        const shown = Math.max(0, Math.min(cs.length, count - starts[pi]));
        return (
          <p key={pi} data-reveal={reveal || undefined} className={paragraphClassName}>
            <span className="relative block">
              <span className="sr-only">{paragraphs[pi]}</span>
              {/* يحجز المكان كاملاً — ويبقى ظاهراً لمن عطّل السكربت */}
              <span aria-hidden="true" className="js:invisible">
                {paragraphs[pi]}
              </span>
              <span aria-hidden="true" className="absolute inset-0 nojs:hidden">
                {cs.slice(0, shown).join("")}
                {caret && pi === active && (
                  /* عرضه صفر، فلا يدفع آخر كلمة إلى سطر جديد */
                  <span className="relative inline-block h-[1.1em] w-0 align-[-0.2em]">
                    <span
                      className={cn(
                        "absolute inset-y-0 start-0.5 w-[2px] rounded-full bg-gold/85",
                        phase !== "typing" && "animate-erth-caret",
                      )}
                    />
                  </span>
                )}
              </span>
            </span>
          </p>
        );
      })}
    </div>
  );
}
