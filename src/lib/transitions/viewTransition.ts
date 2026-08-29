export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function withViewTransition(update: () => void | Promise<void>) {
  if (prefersReducedMotion() || !("startViewTransition" in document)) {
    update();
    return undefined;
  }
  const transition = document.startViewTransition(update);
  // A newer transition skips this one before it settles (e.g. rapid
  // next/prev clicks) — that rejects ready/finished; nothing needs to react.
  transition.ready.catch(() => {});
  transition.finished.catch(() => {});
  return transition;
}
