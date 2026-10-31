# 0005. Replace the custom lightbox with GLightbox

Status: Accepted

## Context

The gallery lightbox was about 630 lines of our own code, with no zoom, and every fix (see [0004](0004-lightbox-no-scroll-lock.md)) was ours to maintain. We wanted a small library with no dependencies that covers navigation, zoom and captions.

PhotoSwipe was the only other library tried, and it didn't work smoothly out of the box.

## Decision

Use GLightbox. Triggers still use `data-lightbox-target` and `data-lightbox-index`, so the markup that opens a gallery didn't change. The library loads on first hover, focus or click, and each gallery gets one reusable viewer (a new one per open broke reopening).

## Consequences

Much less code, and zoom comes for free. The open animation is a fade, not a morph from the thumbnail. GLightbox only offers English button labels, so we set the translated ones from the script. Don't override the slide image's `max-height`, because that broke zoom.

The mobile Safari problems behind 0004 don't occur with GLightbox.
