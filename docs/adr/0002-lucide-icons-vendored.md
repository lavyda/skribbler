# 0002. Use only Lucide icons, copied into the project

Status: Accepted

## Context

The site needs icons. The options were an icon font, an npm package like `lucide-svelte` with a central name registry, or hand-picked SVGs committed to the repo.

## Decision

Pick icons only from https://lucide.dev, and don't add a Lucide npm dependency. For each icon actually used, copy its SVG from the site into its own component under `src/lib/ui/icons/`, named after the Lucide icon (e.g. `Sun.svelte`). Match the existing files' conventions: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, round caps and joins, plus a spread `SVGAttributes<SVGSVGElement>` props type. Render it through `Icon.svelte`'s `glyph` prop, not a name lookup.

## Consequences

Adding an icon is a copy-paste from lucide.dev plus a new file, not an install. Only icons actually imported end up in the bundle. Lucide updates to an icon's path don't propagate automatically. Re-copy by hand if that's ever wanted. Every icon in the app carries the same stroke weight and style since they all come from one source.
