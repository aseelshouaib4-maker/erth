"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatCopy, genericAnswer, mockAnswers, suggestedQuestions, type ChatMessage } from "@/data/chat";
import { ui } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { SearchIcon, SendIcon } from "@/components/ui/Icons";
import { Ornament } from "@/components/ui/Ornament";
import { AnswerCard, TypingIndicator, UserBubble } from "./Messages";

type Props = {
  /** question to send automatically on mount (from a suggested-question chip elsewhere) */
  seed?: string;
  /** compact variant embedded inside the intro closing step */
  embedded?: boolean;
  /** يُخبر الحاوية أنّ الحوار بدأ، فتنكمش ترويستها */
  onStarted?: (started: boolean) => void;
  onNavigate?: () => void;
  className?: string;
};

let counter = 0;
const nextId = () => `m-${Date.now()}-${counter++}`;

/**
 * UI-only conversation. Answers are mock records shaped like the future API
 * (video answer + related sections + extra results).
 */
export function ChatPanel({ seed, embedded, onStarted, onNavigate, className }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  const ask = useCallback(
    (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      setBusy(true);
      setValue("");
      const typingId = nextId();
      setMessages((m) => [...m, { id: nextId(), role: "user", text: q }, { id: typingId, role: "assistant", typing: true }]);
      const t = window.setTimeout(() => {
        const answer = mockAnswers[q] ?? genericAnswer;
        setMessages((m) => m.map((msg) => (msg.id === typingId ? { id: typingId, role: "assistant", answer: { ...answer, id: `${answer.id}-${typingId}` } } : msg)));
        setBusy(false);
      }, 1100);
      timers.current.push(t);
    },
    [busy],
  );

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const started = messages.length > 0;
  useEffect(() => {
    onStarted?.(started);
  }, [started, onStarted]);

  // keep the latest `ask` reachable from the seed effect without re-running it
  const askRef = useRef(ask);
  useEffect(() => {
    askRef.current = ask;
  }, [ask]);

  useEffect(() => {
    if (!seed) return;
    const t = window.setTimeout(() => askRef.current(seed), 0);
    return () => window.clearTimeout(t);
  }, [seed]);

  // animate the newest message and keep the list scrolled to the end
  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;
      const last = list.lastElementChild as HTMLElement | null;
      if (last) {
        const reduced = prefersReducedMotion();
        gsap.fromTo(last, { opacity: 0, y: reduced ? 0 : 18 }, { opacity: 1, y: 0, duration: reduced ? 0 : 0.7, ease: "power3.out" });
      }
      const scroller = list.parentElement;
      if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    },
    { dependencies: [messages.length], scope: listRef },
  );

  const empty = !started;

  /* عمودٌ واحد مركزيّ: يتّسع على الشاشات الكبيرة ولا يتمدّد بلا حدّ */
  const column = "mx-auto w-full max-w-4xl";

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {empty ? (
          <div className={cn("flex min-h-full flex-col justify-end", column, embedded ? "px-1 py-6" : "px-5 py-8 md:px-10 md:py-12")}>
            {!embedded && (
              <>
                <Ornament unit="star" className="mb-6 w-10 text-gold" />
                <h2 className="text-heading max-w-xl text-[clamp(1.5rem,3vw,2.4rem)] text-cream text-balance">{ui.chatPrompt}</h2>
                <p className="mt-4 max-w-md text-[0.88rem] leading-[1.9] text-blue-32">{chatCopy.greeting}</p>
              </>
            )}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="h-10 border border-cream/20 px-4 text-[0.8rem] text-cream/85 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={listRef} className={cn("flex flex-col gap-7", column, embedded ? "px-1 py-6" : "px-5 py-8 md:px-10")}>
            {messages.map((m) =>
              m.role === "user" ? (
                <UserBubble key={m.id} text={m.text} />
              ) : "typing" in m ? (
                <TypingIndicator key={m.id} />
              ) : (
                <AnswerCard key={m.id} answer={m.answer} onNavigate={onNavigate} onAsk={ask} />
              ),
            )}
          </div>
        )}
      </div>

      <form
        className={cn("shrink-0 border-t border-cream/10", column, embedded ? "pt-4" : "px-5 py-4 md:px-10 md:py-5")}
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
          inputRef.current?.focus();
        }}
      >
        <div className="flex items-center gap-3 border border-cream/20 bg-night/40 ps-4 pe-2 transition-colors focus-within:border-gold">
          <SearchIcon className="h-4 w-4 shrink-0 text-blue-54" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={ui.chatPlaceholder}
            className="no-focus-ring h-12 min-w-0 flex-1 bg-transparent text-[0.92rem] text-cream placeholder:text-blue-54 focus:outline-none"
            aria-label={ui.chatPlaceholder}
          />
          <button
            type="submit"
            disabled={busy || !value.trim()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-gold text-night transition-opacity disabled:opacity-40"
            aria-label={ui.send}
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-[0.62rem] tracking-[0.08em] text-blue-54">{chatCopy.note}</p>
      </form>
    </div>
  );
}
