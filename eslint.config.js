import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-plugin-prettier/recommended";
import svelteConfig from "./svelte.config.js";

export default defineConfig(
  { ignores: ["dist/", ".astro/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...[
    { files: ["**/*.astro"], parser: "astro" },
    { files: ["**/*.svelte"], parser: "svelte" },
  ].map(({ files, parser }) => ({
    files,
    rules: {
      "prettier/prettier": [
        "error",
        {
          parser,
          plugins: ["prettier-plugin-astro", "prettier-plugin-svelte"],
        },
        { usePrettierrc: false },
      ],
    },
  })),
  {
    // <script> blocks in .astro files are linted as virtual files; Prettier
    // formats them as part of the whole .astro file instead.
    files: ["**/*.astro/*.js", "**/*.astro/*.ts"],
    rules: { "prettier/prettier": "off" },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { parser: tseslint.parser, svelteConfig },
    },
  },
  {
    files: [
      "scripts/**/*.js",
      "scripts/**/*.mjs",
      "scripts/**/*.ts",
      "scripts/**/*.mts",
    ],
    languageOptions: { globals: globals.node },
  },
  {
    // project rule overrides go here
    rules: {},
  },
);
