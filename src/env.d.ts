declare namespace App {
  type Locale = "en" | "sk";
  interface Locals {
    locale: Locale;
    defaultLocale: Locale;
    locales: Locale[];
  }
}
