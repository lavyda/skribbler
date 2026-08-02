const BCP47: Record<App.Locale, string> = {
  en: "en-GB",
  sk: "sk-SK",
};

export function dateFormatter(locale: App.Locale): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(BCP47[locale], { dateStyle: "long" });
}
