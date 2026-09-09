"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type UIState = {
  introVisible: boolean;
  showIntro: () => void;
  hideIntro: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  assistantOpen: boolean;
  /** a question asked elsewhere, sent as soon as the assistant opens */
  assistantSeed?: string;
  openAssistant: (seed?: string) => void;
  closeAssistant: () => void;
};

const UIContext = createContext<UIState | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [introVisible, setIntroVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantSeed, setAssistantSeed] = useState<string | undefined>(undefined);

  const showIntro = useCallback(() => setIntroVisible(true), []);
  const hideIntro = useCallback(() => setIntroVisible(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openAssistant = useCallback((seed?: string) => {
    setAssistantSeed(seed);
    setAssistantOpen(true);
  }, []);
  const closeAssistant = useCallback(() => setAssistantOpen(false), []);

  const value = useMemo(
    () => ({
      introVisible,
      showIntro,
      hideIntro,
      searchOpen,
      openSearch,
      closeSearch,
      assistantOpen,
      assistantSeed,
      openAssistant,
      closeAssistant,
    }),
    [introVisible, showIntro, hideIntro, searchOpen, openSearch, closeSearch, assistantOpen, assistantSeed, openAssistant, closeAssistant],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <Providers>");
  return ctx;
}
