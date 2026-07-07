import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.locale = context.currentLocale ?? "en";
  return next();
});
