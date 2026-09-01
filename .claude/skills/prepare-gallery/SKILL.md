---
name: prepare-gallery
description: Prepares a batch of exported photos for a gallery. Strips metadata, names each file, and writes the gallery content entry. Use when the user wants to build or publish a photo gallery.
---

# Prepare gallery

Turns a batch of freshly exported photos into a gallery entry ready to upload to the CDN and publish, following the process in `docs/guides/preparing-photos.md`.

## When to use

The user provides one or more photo files, or a folder of them, and wants a gallery built from them. For example: "prepare a gallery from these photos" or `/prepare-gallery ~/exports/iceland`.

## Inputs

Treat the skill argument, if given, as the starting file or folder path. Ask for it if none was given.

## Steps

1. **Gather context.** Ask the user for:
   - Gallery title
   - Gallery file name (the slug), suggesting a kebab-cased version of the English title as a default; it stays English even when the gallery's content is `sk`-only or bilingual
   - Description
   - Where the photos were taken
   - When (a date or date range)
   - What the gallery is about, plus anything worth knowing about individual photos
   - Tags, if any
   - Which locales to write content for (this repo uses `en` and `sk`; default to `en` only unless the user asks for both)

   Don't block on every field. If the user already covered something in their first message, don't ask again.

2. **Create the overview file.** Create `tmp/<gallery-slug>.md` in the repo (already git-ignored) and write the title, description, tags, dates, location, and locales gathered in step 1 into it.

3. **Analyze the originals, before anything is stripped.** For each source photo:
   - Read its EXIF directly, since some of this data won't survive stripping. Run from the repo root so `exifr` (already a devDependency) resolves:
     ```sh
     node -e 'import("exifr").then(async ({ default: exifr }) => console.log(await exifr.parse("path/to/photo.jpg", { translateValues: false, mergeOutput: true })))'
     ```
     Pull `DateTimeOriginal` for ordering in step 5. If `GPSLatitude`/`GPSLongitude` are present, resolve them to a concrete place name (city, town, or landmark), for example a reverse geocoding lookup via WebFetch against Nominatim. Add that place name to the overview file, never the raw coordinates, as a hint alongside the location the user already gave in step 1. It's a hint for the user to confirm, edit, or ignore, not a fact to publish: don't copy it into the gallery JSON, `alt`, or `caption` yourself, and raw GPS coordinates must never survive into any output.
   - Look at the image itself and note what's in it. If its EXIF `Orientation` is 3, 6, or 8, account for the rotation when reading the image, since it may still render unrotated at this stage. This feeds the filename slug and the `alt`/`caption`, see "Writing alt and caption text" below.

   Add each photo's filename slug, capture date, place hint, `alt`, and `caption` to the overview file from step 2. If a locale beyond `en` was requested, draft a translation of the title, description, and each photo's `alt`/`caption` and add it alongside the English text, one locale per section.

   Once every photo is in, point the user to the file and ask them to review it. Apply their edits or corrections directly to the file. Don't strip, rename, or write anything else until they've confirmed.

4. **Strip metadata.**
   ```sh
   npm run strip-exif -- <photo paths>
   ```
   See `docs/guides/preparing-photos.md` for what this keeps and drops.

5. **Order the photos.** Use the capture times collected in step 3 when present on every photo. Otherwise keep the order the user gave them in. Show the resulting order to the user — as the section order in the overview file — and ask them to confirm it before renaming. That section order is the standing record of the confirmed order from here on, so any later reshuffle of the overview file's sections is itself a reorder request; see "Changing the order later" below.

6. **Rename each photo.** Using the confirmed slug, `alt`, and `caption` from step 3, copy (don't move) each stripped file to `<gallery-slug>-<sequence>-<photo-slug>.<ext>` inside a new `ready/` folder next to the source photos. Number sequentially from `01`, in the order from step 5.

7. **Write the gallery entry.** Create `src/content/gallery/<locale>/<gallery-slug>.json` per the schema in `src/content.config.ts`: `title`, `description`, `tags`, `created`, `photos` (`src`, `alt`, `caption`). Build each `src` as `https://ik.imagekit.io/vladimir/<gallery-slug>/<renamed-filename>` (see [ADR 0003](../../../docs/adr/0003-imagekit-cdn-for-gallery-photos.md)). Repeat per requested locale, copying the confirmed `title`, `description`, `alt`, and `caption` for that locale from the overview file, while keeping the same `src` and photo order across locales.

8. **Report.** List the files now in `ready/` and the gallery JSON path(s) written. Tell the user to upload everything in `ready/` to the `<gallery-slug>` folder in the ImageKit media library.

9. **Clean up.** Once the user confirms the upload is done and they're ready to publish, ask whether to delete the generated content: the `ready/` folder and the `tmp/` overview file. Only delete on their confirmation. Leave the original source photos alone.

## Changing the order later

The sequence number is baked into each photo's filename, so a reorder after step 6 needs more than editing one number.

- Rebuild `ready/` from the stripped originals (the source files stripped in step 4, not the `ready/` copies) rather than renaming in place — renaming in place risks a collision when two files swap positions.
- Update the `photos` array in every locale's gallery JSON to the new order, with `src` reflecting each photo's new sequence number.
- Renumber the section headers in the overview file to match, so it stays an accurate record.
- If `ready/` was already uploaded to ImageKit under the old names, tell the user those are now orphaned and need deleting; the new filenames must be uploaded fresh since a local rename doesn't touch the CDN.

## Writing alt and caption text

- `alt`: one simple sentence, literal, no listing multiple details.
- `caption`: also one simple sentence, describing only what's visible in the photo. No fancy or poetic language, no assumptions about anything not clearly shown (mood, backstory, exact place, weather, and so on).
- No period at the end of either.
