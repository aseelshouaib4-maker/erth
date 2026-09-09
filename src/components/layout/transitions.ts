/** Tiny event bus for page-transition choreography (curtain in / out). */
export const CURTAIN_IN = "erth:curtain-in";
export const CURTAIN_OUT = "erth:curtain-out";
export const INTRO_CLOSED = "erth:intro-closed";

export function emit(name: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name));
}

export function on(name: string, handler: () => void) {
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}
