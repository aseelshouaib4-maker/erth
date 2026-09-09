"use client";

import { useState } from "react";
import { suggestedQuestions } from "@/data/chat";
import { ui } from "@/data/site";
import { useReveal } from "@/hooks/useReveal";
import { useUI } from "@/components/layout/Providers";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { Ornament } from "@/components/ui/Ornament";
import { SearchIcon, SendIcon } from "@/components/ui/Icons";

/**
 * The assistant's front door, directly under the hero. Asking here opens the
 * assistant with the question already sent.
 */
export function AssistantEntry() {
  const ref = useReveal<HTMLElement>();
  const { openAssistant } = useUI();
  const [value, setValue] = useState("");

  return (
    <section id="assistant" ref={ref} className="relative overflow-hidden bg-blue-dark pb-16 pt-24 md:pb-20 md:pt-32">
      <OrnamentGrid scale={1} fade="radial" opacity={0.08} />
      <div className="px-gutter relative mx-auto max-w-4xl text-center">
        <div data-reveal className="flex justify-center">
          <Ornament unit="star" className="w-12 text-gold" />
        </div>
        <p data-reveal className="eyebrow tracking-sep mt-8">
          {ui.chatTitle}
        </p>
        <h2 data-reveal className="text-heading mt-5 text-[clamp(1.8rem,4.2vw,3.6rem)] text-cream text-balance">
          {ui.assistantTitle}
        </h2>
        <p data-reveal className="mx-auto mt-5 max-w-lg text-[0.9rem] leading-[1.9] text-blue-32">
          {ui.assistantLead}
        </p>

        <form
          data-reveal
          onSubmit={(e) => {
            e.preventDefault();
            openAssistant(value.trim() || undefined);
            setValue("");
          }}
          className="group mx-auto mt-10 flex w-full max-w-xl items-center gap-4 border border-cream/25 bg-night/40 ps-5 pe-2 text-start transition-colors focus-within:border-gold hover:border-gold"
        >
          <SearchIcon className="h-4 w-4 shrink-0 text-blue-54 transition-colors group-hover:text-gold" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={ui.chatPlaceholder}
            aria-label={ui.chatPlaceholder}
            className="h-14 min-w-0 flex-1 bg-transparent text-[0.92rem] text-cream placeholder:text-blue-54 focus:outline-none"
          />
          <button
            type="submit"
            aria-label={ui.send}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-gold text-night transition-colors hover:bg-gold-soft"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </form>

        <div data-reveal className="mt-6 flex flex-wrap justify-center gap-2.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => openAssistant(q)}
              className="h-10 border border-cream/15 px-4 text-[0.78rem] text-cream/80 transition-colors hover:border-gold hover:text-gold"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
