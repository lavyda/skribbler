import { getCollection, type CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { i18n } from "astro:config/server";

export type Locale = App.Locale;

/** Locale → URL of the same content in that locale. */
export type Alternates = Partial<Record<Locale, string>>;

/** Route segment of every collection that has a page per entry. */
const ROUTES = { blogs: "blog", galleries: "gallery" } as const;
type Translatable = keyof typeof ROUTES;

export const localeOf = (entry: { id: string }): Locale =>
  entry.id.split("/")[0] as Locale;

export const slugOf = (entry: { id: string }): string =>
  entry.id.split("/").slice(1).join("/");

export const entryUrl = (
  collection: Translatable,
  entry: { id: string },
): string =>
  getRelativeLocaleUrl(localeOf(entry), `${ROUTES[collection]}/${slugOf(entry)}`);

const locales = (): Locale[] =>
  (i18n?.locales.flatMap((l) => (typeof l === "string" ? l : l.codes)) ?? [
    "en",
    "sk",
  ]) as Locale[];

/**
 * URLs of an entry in every locale it exists in, itself included. Entries
 * sharing a `translationKey` are translations of each other; without a key the
 * entry has no counterparts.
 */
export async function getAlternates<C extends Translatable>(
  collection: C,
  entry: CollectionEntry<C>,
): Promise<Alternates> {
  const own = { [localeOf(entry)]: entryUrl(collection, entry) } as Alternates;
  const key = entry.data.translationKey;
  if (!key) return own;

  const group = await getCollection(
    collection,
    ({ data }) =>
      data.translationKey === key && (!import.meta.env.PROD || !data.draft),
  );

  const alternates: Alternates = {};
  for (const e of group) {
    const locale = localeOf(e);
    if (alternates[locale]) {
      throw new Error(
        `${collection}: "${e.id}" and another ${locale} entry share translationKey "${key}"`,
      );
    }
    alternates[locale] = entryUrl(collection, e);
  }
  return { ...alternates, ...own };
}

/** Pages without content behind them exist under the same path in every locale. */
export function getMirroredAlternates(pathname: string): Alternates {
  const [, ...rest] = pathname.split("/").filter(Boolean);
  const path = rest.join("/");
  return Object.fromEntries(
    locales().map((l) => [l, getRelativeLocaleUrl(l, path)]),
  );
}

/** Section index (`/xx/blog/`) to fall back to when a translation is missing. */
export const sectionUrl = (locale: Locale, pathname: string): string => {
  const section = pathname.split("/").filter(Boolean)[1] ?? "";
  return getRelativeLocaleUrl(locale, section);
};
