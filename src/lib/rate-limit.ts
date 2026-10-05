import "server-only";

/**
 * Fixed-window limiter kept in process memory. Enough for a single Node
 * process behind nginx; a multi-instance deployment would move this to a
 * shared store.
 */
type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
const SWEEP_EVERY = 500;
let calls = 0;

function sweep(now: number) {
  for (const [key, window] of windows) if (window.resetAt <= now) windows.delete(key);
}

/** True when `key` may act again: at most `limit` times per `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (++calls % SWEEP_EVERY === 0) sweep(now);
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
