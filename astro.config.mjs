// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  i18n: {
    locales: ["en", "sk"],
    defaultLocale: "en",
  },
  vite: { build: { cssMinify: 'esbuild' } },
});