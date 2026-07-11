import { i18n } from "astro:config/server";                                                                                                               
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.locale = (context.currentLocale ?? i18n?.defaultLocale ?? "en") as App.Locale;                                                                              
  context.locals.locales = (i18n?.locales.flatMap((l) => typeof l === "string" ? l : l.codes) ?? ["en", "sk"]) as App.Locale[];       
  return next();
});
