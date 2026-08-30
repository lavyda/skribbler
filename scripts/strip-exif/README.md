# strip-exif

Removes privacy-sensitive metadata from a photo and caps its resolution, while keeping the camera/lens model and shooting details (aperture, shutter speed, etc.) that aren't private.

## Usage

```sh
# a single file
npm run strip-exif -- path/to/photo.jpg

# a whole folder (recurses into subfolders)
npm run strip-exif -- path/to/folder

# several at once
npm run strip-exif -- photo1.jpg photo2.png path/to/folder

# override the default 3840px resolution cap
npm run strip-exif -- --max 1600 path/to/photo.jpg
```

It edits the file in place, so run it on a copy or export, not a master file you can't easily re-create. There's no undo.

## What it removes vs. keeps

Removed (private):
- GPS location
- Camera & lens serial numbers
- Owner/author name, copyright
- Last-modified date (edit history)
- Embedded thumbnail/preview
- IPTC & XMP fields (keywords, captions, contact info)
- Any other maker-specific data

Kept (not private):
- Camera make & model, lens model
- Capture date & time
- Shutter speed
- Aperture (f-number)
- ISO
- Focal length
- Flash, white balance
- Metering mode, exposure program
- Exposure compensation

If the photo has none of the kept fields to begin with, it comes out clean. Nothing is invented.

## Notes

- Supported file types: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.tiff`.
- If the photo carries an EXIF orientation tag, the script bakes that rotation into the pixels first, so it still displays upright once the metadata is gone.
- Wide-gamut photos (some phone cameras shoot in one) get converted to sRGB instead of having their profile just dropped, so color doesn't shift.
- Photos longer than 3840px on their longest side get scaled down to fit, aspect ratio preserved. A smaller photo is left at its original size, never enlarged. Use `--max <px>` to change the cap.
- Every photo is re-encoded, even one left at its original size, since baking in the rotation and sRGB conversion requires it. JPEG, WebP, and AVIF are re-encoded at quality 100 so that pass doesn't lose quality. PNG and TIFF stay lossless.
