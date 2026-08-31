// Fixed, shared across grid/covers/lightbox — deliberately the only widths
// the app ever requests, so switching to preprocessed static files later is
// just a URL-builder swap; the width-selection logic doesn't change.
export const IMAGE_WIDTHS = [320, 480, 640, 960, 1280, 1920, 2560, 3200, 3840] as const;

// Per-context subsets of IMAGE_WIDTHS, kept next to it so they can't drift
// out of sync with the approved set.
export const GRID_WIDTHS = [320, 480, 640, 960] as const;
export const COVER_WIDTHS = [640, 960, 1280, 1920, 2560] as const;

export function nearestWidth(target: number): number {
  return IMAGE_WIDTHS.reduce((best, w) =>
    Math.abs(w - target) < Math.abs(best - target) ? w : best,
  );
}

export function imagekitUrl(
  src: string,
  opts: { width?: number; quality?: number } = {},
): string {
  const url = new URL(src);
  const parts: string[] = [];
  if (opts.width) parts.push(`w-${opts.width}`);
  parts.push(`q-${opts.quality ?? 100}`, "f-auto");
  url.searchParams.set("tr", parts.join(","));
  return url.toString();
}

export function imagekitSrcSet(src: string, widths: readonly number[]): string {
  return widths.map((w) => `${imagekitUrl(src, { width: w })} ${w}w`).join(", ");
}
