export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function withViewTransition(update: () => void | Promise<void>) {
  if (prefersReducedMotion() || !("startViewTransition" in document)) {
    update();
    return;
  }
  document.startViewTransition(update);
}
