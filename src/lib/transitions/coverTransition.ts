const SHARED_COVER_NAME = "cover-shared";
const SHARED_META_NAME = "meta-shared";

function roleSelector(role: string) {
  return `[data-transition-role="${role}"]`;
}

function untag(el: HTMLElement | null) {
  if (el) el.style.viewTransitionName = "";
}

let taggedCover: HTMLElement | null = null;
let taggedMeta: HTMLElement | null = null;

// A card's cover/meta transition:name can't be baked in at build time —
// the same PostPreview/GalleryPreview card renders on its own index page
// and inside another post's related-posts section, so a static per-item
// name would exist twice on some page pairs (e.g. two posts that
// reference each other) and collide. Instead, the pair is picked at
// click time: whichever card was actually clicked gets tagged right
// before the browser snapshots the old page, and only that card's
// cover/meta compete for the name.
export function initCoverTransitions() {
  document.addEventListener("astro:before-preparation", (event) => {
    untag(taggedCover);
    untag(taggedMeta);
    taggedCover = null;
    taggedMeta = null;

    const card = event.sourceElement?.closest("article");
    if (!card) return;

    taggedCover = card.querySelector<HTMLElement>(roleSelector("card-cover"));
    taggedMeta = card.querySelector<HTMLElement>(roleSelector("card-meta"));
    if (taggedCover) taggedCover.style.viewTransitionName = SHARED_COVER_NAME;
    if (taggedMeta) taggedMeta.style.viewTransitionName = SHARED_META_NAME;
  });

  document.addEventListener("astro:before-swap", (event) => {
    const cover = taggedCover;
    const meta = taggedMeta;
    let heroCover: HTMLElement | null = null;
    let heroMeta: HTMLElement | null = null;

    if (cover) {
      heroCover = event.newDocument.querySelector<HTMLElement>(
        roleSelector("hero-cover"),
      );
      if (heroCover) heroCover.style.viewTransitionName = SHARED_COVER_NAME;
    }
    if (meta) {
      heroMeta = event.newDocument.querySelector<HTMLElement>(
        roleSelector("hero-meta"),
      );
      if (heroMeta) heroMeta.style.viewTransitionName = SHARED_META_NAME;
    }

    // The hero landing on the live page keeps the shared name until the
    // transition settles — clear it once done, or the next click-driven
    // transition on this same page would find the name already taken.
    (event.viewTransition?.finished ?? Promise.resolve())
      .catch(() => {})
      .then(() => {
        untag(heroCover);
        untag(heroMeta);
      });
  });
}
