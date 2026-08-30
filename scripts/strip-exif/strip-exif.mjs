#!/usr/bin/env node
// Strips privacy-sensitive EXIF/IPTC/XMP data from image files, keeping
// only: exposure data (shutter speed, aperture, ISO, focal length, flash,
// white balance, metering mode, exposure program, exposure compensation),
// device/lens model names (not their serial numbers), and the capture date.
//
// Dropped: GPS, device/lens serial numbers, owner/author fields,
// embedded thumbnail, IPTC, XMP, maker notes.
//
// Usage: node scripts/strip-exif/strip-exif.mjs <file-or-dir> [...more]
import sharp from "sharp";
import exifr from "exifr";
import { readdir, rename, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff"]);

// [exifr's flattened read-side key, sharp's write-side key, type, target IFD]
const KEPT_TAGS = [
  ["Make", "Make", "string", "IFD0"],
  ["Model", "Model", "string", "IFD0"],
  ["ExposureTime", "ExposureTime", "rational", "IFD2"],
  ["FNumber", "FNumber", "rational", "IFD2"],
  ["ISO", "ISOSpeedRatings", "int", "IFD2"],
  ["FocalLength", "FocalLength", "rational", "IFD2"],
  ["Flash", "Flash", "int", "IFD2"],
  ["WhiteBalance", "WhiteBalance", "int", "IFD2"],
  ["MeteringMode", "MeteringMode", "int", "IFD2"],
  ["ExposureProgram", "ExposureProgram", "int", "IFD2"],
  ["ExposureCompensation", "ExposureBiasValue", "rational", "IFD2"],
  ["LensModel", "LensModel", "string", "IFD2"],
  ["DateTimeOriginal", "DateTimeOriginal", "datetime", "IFD2"],
];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Rebuilds an EXIF rational ("num/den") from exifr's decimal value.
// Exposure values are simple fractions, so this round-trips exactly
// (e.g. 0.002 -> "1/500", 1.8 -> "9/5").
function toRational(value) {
  if (value === 0) return "0/1";
  const sign = value < 0 ? -1 : 1;
  const scale = 10000;
  const num = Math.round(Math.abs(value) * scale);
  const divisor = gcd(num, scale) || 1;
  return `${sign * (num / divisor)}/${scale / divisor}`;
}

// Rebuilds an EXIF datetime ("YYYY:MM:DD HH:MM:SS") from exifr's Date.
// exifr revives the naive EXIF timestamp using the local timezone, so
// reading it back with local (not UTC) getters round-trips exactly.
function toExifDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}:${pad(date.getMonth() + 1)}:${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatKeptValue(value, kind) {
  if (kind === "rational") return toRational(value);
  if (kind === "datetime") return toExifDateTime(value);
  return String(value);
}

async function readKeptTags(path) {
  const parsed = await exifr
    .parse(path, { translateValues: false, mergeOutput: true })
    .catch(() => null);
  if (!parsed) return null;

  const byIfd = {};
  for (const [readKey, writeKey, kind, ifd] of KEPT_TAGS) {
    const value = parsed[readKey];
    if (value === undefined || value === null) continue;
    byIfd[ifd] ??= {};
    byIfd[ifd][writeKey] = formatKeptValue(value, kind);
  }
  return Object.keys(byIfd).length > 0 ? byIfd : null;
}

async function collectFiles(path) {
  const s = await stat(path);
  if (s.isFile()) return EXTS.has(extname(path).toLowerCase()) ? [path] : [];
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => collectFiles(join(path, entry.name))),
  );
  return nested.flat();
}

async function stripOne(path) {
  const image = sharp(path);
  const { orientation } = await image.metadata();
  const kept = await readKeptTags(path);

  // Bakes orientation into the pixels before metadata is dropped, or the
  // image displays sideways. Forces sRGB so a wide-gamut source doesn't
  // shift color once its ICC profile is gone.
  let pipeline = image.rotate().toColorspace("srgb");
  if (kept) {
    // Replaces the EXIF block outright (unlike withMetadata, which keeps
    // everything) — only the tags above survive.
    pipeline = pipeline.withExif(kept);
  }
  const buffer = await pipeline.toBuffer();

  const tmp = `${path}.tmp`;
  await writeFile(tmp, buffer);
  await rename(tmp, path);

  const keptCount = kept ? Object.values(kept).reduce((n, ifd) => n + Object.keys(ifd).length, 0) : 0;
  const note = [
    orientation > 1 ? "de-rotated" : null,
    keptCount > 0 ? `kept ${keptCount} tags` : null,
  ]
    .filter(Boolean)
    .join(", ");
  console.log(`stripped ${path}${note ? ` (${note})` : ""}`);
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("usage: node scripts/strip-exif/strip-exif.mjs <file-or-dir> [...]");
  process.exit(1);
}

const files = (await Promise.all(targets.map(collectFiles))).flat();
for (const file of files) {
  await stripOne(file);
}
console.log(`done — ${files.length} file(s) stripped`);
