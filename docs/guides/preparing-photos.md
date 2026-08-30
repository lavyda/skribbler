# Preparing photos

Steps to take a photo from export to published.

## 1. Strip metadata and cap resolution

Every photo runs through the same script first, no exceptions. Any file can carry identifying metadata regardless of where it came from or what it's for.

```sh
npm run strip-exif -- path/to/photo.jpg
```

It removes anything that identifies you or where the photo was taken: GPS, device serials, owner name, edit history, embedded thumbnail. It keeps the camera/lens model, capture date, and shooting details like aperture, shutter speed, and ISO. It also scales down anything over 3840px on its longest side, no page on this site displays a photo any larger than that. See [`scripts/strip-exif/README.md`](../../scripts/strip-exif/README.md) for the full breakdown.

## Blog cover

The stripped photo goes straight into the repo: save it under `src/content/blog/<locale>/` and reference it from the post's `cover` frontmatter field.

## Gallery photos

Gallery photos aren't stored in the repo, they're hosted on ImageKit (see [ADR 0003](../adr/0003-imagekit-cdn-for-gallery-photos.md)). Strip the file locally first, then upload it to the gallery's folder in the ImageKit media library, and reference the resulting HTTPS URL in the gallery entry's `photos` array.

Name each file `<gallery-slug>-<sequence>-<short-slug>.<ext>`, for example `canyon-trip-001-river-bend.jpg`. The gallery slug should match both the gallery's JSON id (`canyon-trip.json`) and its ImageKit folder name, so photos sort together and stay easy to trace back to their gallery. Skip the original camera filename like `IMG_1234.JPG`. It doesn't say anything about the photo.

The resulting URL is always `https://ik.imagekit.io/vladimir/<gallery-slug>/<filename>`, for example `https://ik.imagekit.io/vladimir/morocco-2025/morocco-2025-006-layered-dunes-dusk.jpeg`.

If you replace a photo under the same name later, the CDN and browsers may keep serving the cached old version. Bump the sequence or slug on replacement so the changed file gets a new URL.
