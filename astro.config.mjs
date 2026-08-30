// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx()],
  image: {
    remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
  },
  i18n: {
    locales: ["en", "sk"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
  },
  redirects: {
    "/": "/en/",
  },
  vite: { build: { cssMinify: 'esbuild' } },
});