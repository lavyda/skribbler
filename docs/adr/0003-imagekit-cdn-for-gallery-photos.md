# 0003. Host gallery photos on ImageKit

Status: Accepted

## Context

Gallery photos aren't stored in the repo, they're hosted on a CDN and referenced by HTTPS URL from each gallery's content entry. The prepare-gallery workflow needed a concrete CDN to point at instead of a placeholder domain.

## Decision

Host gallery photos on ImageKit, under the `vladimir` URL-endpoint. Each gallery gets its own folder in the media library named after the gallery slug, and stripped photos upload there unchanged (same filename produced by the prepare-gallery workflow).

URL pattern: `https://ik.imagekit.io/vladimir/<gallery-slug>/<filename>`

Example: `https://ik.imagekit.io/vladimir/morocco-2025/morocco-2025-006-layered-dunes-dusk.jpeg`

## Consequences

The gallery `src` field is always derivable from the gallery slug and filename, no per-gallery CDN base URL needs asking for or recording anymore. ImageKit's URL-based transformation params (resize, format, quality) become available for later use, on top of the fixed caps `strip-exif` already applies. Moving off ImageKit later means updating every existing gallery entry's `src` values, since the URL is baked into content instead of built from a shared constant.
