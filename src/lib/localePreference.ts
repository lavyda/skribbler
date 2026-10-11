const SAVED = "lang";
const DISMISSED = "lang-dismissed";

/** Browser languages we serve through a close relative. */
const RELATED: Record<string, string> = { cs: "sk" };

// The build writes the site's locales onto <html data-locales data-default-locale>.
const html = () => document.documentElement.dataset;
export const siteLocales = (): string[] => html().locales!.split(",");
export const defaultLocale = (): string => html().defaultLocale!;

// Storage can throw (private mode, blocked cookies); a missing preference is fine.
const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  // eslint-disable-next-line no-empty
  } catch {}
};

/** Locale the visitor picked explicitly. */
const getSaved = (): string | null => {
  const saved = read(SAVED);
  return saved && siteLocales().includes(saved) ? saved : null;
};

/** First browser language that the site supports. */
const detect = (): string | null => {
  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of tags) {
    const language = tag.toLowerCase().split("-")[0];
    const locale = RELATED[language] ?? language;
    if (siteLocales().includes(locale)) return locale;
  }
  return null;
};

/** Saved choice first, then the browser's language. */
export const preferred = (): string | null => getSaved() ?? detect();

export const save = (locale: string) => write(SAVED, locale);

const dismissed = (): string[] => {
  try {
    return JSON.parse(read(DISMISSED) ?? "[]");
  } catch {
    return [];
  }
};

export const isDismissed = (locale: string): boolean =>
  dismissed().includes(locale);

export const dismiss = (locale: string) =>
  write(DISMISSED, JSON.stringify([...new Set([...dismissed(), locale])]));
