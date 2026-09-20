# 0004. Skip background scroll-lock in the lightbox

Status: Accepted

## Context

On mobile Safari, opening the gallery lightbox and then touching/dragging the screen could leave the prev/next arrows hidden behind the bottom toolbar, and closing and immediately reopening the lightbox could show page content bleeding through behind it. Root cause: the lightbox sized itself with static `100vw`/`100vh`, which doesn't track the toolbar hiding or reappearing, and `<dialog>` plus the existing `:root:has(dialog[open]) { overflow: hidden; }` rule don't reliably stop the page behind it from touch-scrolling on iOS Safari — a scroll while the dialog was open could shift the visible viewport out from under a size computed earlier.

The `100vw`/`100vh` values were switched to `100dvw`/`100dvh` (`src/modules/gallery/Lightbox.astro`) so the lightbox tracks the actually-visible viewport. Alongside that, a background scroll-lock was added: pin `body` with `position: fixed` and a negative `top` offset while the dialog is open, restoring the exact scroll position on close, to stop the underlying page from moving at all.

## Decision

Keep the `dvh`/`dvw` sizing, drop the scroll-lock. It isn't needed for now — the dynamic viewport units alone address the reported symptoms in testing, and the scroll-lock adds moving parts (manual scroll-position bookkeeping, a `body` style side effect that runs on every open/close) for a scenario that hasn't shown up as a problem on its own.

## Consequences

The page behind the lightbox can still scroll on touch while it's open. If the toolbar-driven staleness or content bleed-through reoccurs after this, the position:fixed scroll-lock (recorded here, previously implemented in the same file) is the next thing to reach for rather than something to rediscover.
