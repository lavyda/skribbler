import { i18n } from "astro:config/client";

export const LOCALES = i18n?.locales ?? ["en"];
export const DEFAULT_LOCALE = i18n?.defaultLocale ?? "en";
