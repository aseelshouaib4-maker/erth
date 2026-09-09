"use client";

import { useState } from "react";
import { ui } from "@/data/site";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { CloseIcon } from "@/components/ui/Icons";
import { Ornament } from "@/components/ui/Ornament";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { useUI } from "@/components/layout/Providers";
import { ChatPanel } from "./ChatPanel";

/**
 * The assistant, opened over whatever the visitor was reading — full screen,
 * so the conversation has room to breathe.
 *
 * الترويسة كاملةٌ ما دام الحوار لم يبدأ؛ فإذا بدأ انكمشت إلى سطر واحد
 * وتركت الشاشة كلّها للأسئلة والأجوبة.
 */
export function AssistantModal() {
  const { assistantOpen, assistantSeed, closeAssistant } = useUI();
  const [started, setStarted] = useState(false);

  return (
    <Modal open={assistantOpen} onClose={closeAssistant} label={ui.assistantTitle} size="full">
      <div className="relative flex h-full flex-col overflow-hidden bg-blue-dark">
        <OrnamentGrid scale={1} fade="radial" opacity={0.05} />

        <header
          className={cn(
            "relative shrink-0 border-b transition-[padding] duration-500 ease-out-expo",
            started ? "border-cream/10 px-5 py-4 md:px-10" : "border-transparent px-5 pt-10 text-center md:px-10 md:pt-14",
          )}
        >
          <button
            type="button"
            onClick={closeAssistant}
            className="absolute end-5 top-4 inline-flex h-10 w-10 items-center justify-center border border-cream/15 text-cream transition-colors hover:border-gold hover:text-gold md:end-10"
            aria-label={ui.close}
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          {started ? (
            /* سطرٌ واحد أثناء الحوار */
            <div className="mx-auto flex w-full max-w-4xl items-center gap-3">
              <Ornament unit="star" className="w-6 shrink-0 text-gold" />
              <h2 className="text-heading text-[1.05rem] text-cream md:text-[1.2rem]">{ui.assistantTitle}</h2>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <div className="flex justify-center">
                <Ornament unit="star" className="w-9 text-gold md:w-11" />
              </div>
              <p className="eyebrow tracking-sep mt-5">{ui.chatTitle}</p>
              <h2 className="text-heading mt-3 text-[clamp(1.5rem,3.4vw,2.6rem)] text-cream text-balance">
                {ui.assistantTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[0.85rem] leading-[1.9] text-blue-32">{ui.assistantLead}</p>
            </div>
          )}
        </header>

        <ChatPanel
          embedded
          seed={assistantSeed}
          onNavigate={closeAssistant}
          onStarted={setStarted}
          className="relative min-h-0 flex-1 px-5 pb-4 md:px-10 md:pb-6"
        />
      </div>
    </Modal>
  );
}
