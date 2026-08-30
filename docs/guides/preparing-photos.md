# Preparing photos

Steps to take a photo from export to published.

## 1. Strip metadata

Every photo runs through the metadata stripper first, no exceptions. Any file can carry identifying metadata regardless of where it came from or what it's for.

```sh
npm run strip-exif -- path/to/photo.jpg
```

It removes anything that identifies you or where the photo was taken: GPS, device serials, owner name, edit history, embedded thumbnail. It keeps the camera/lens model, capture date, and shooting details like aperture, shutter speed, and ISO. See [`scripts/strip-exif/README.md`](../../scripts/strip-exif/README.md) for the full breakdown.

## Blog cover

The stripped photo goes straight into the repo: save it under `src/content/blog/<locale>/` and reference it from the post's `cover` frontmatter field.

## Gallery photos

Gallery photos aren't stored in the repo, they're hosted on a CDN. Strip the file locally first, then upload it, and reference the resulting HTTPS URL in the gallery entry's `photos` array.

## Next steps

Resizing and compression aren't built yet. This guide will grow as those steps are added.
