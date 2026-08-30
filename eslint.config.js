import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import eslintPluginAstro from "eslint-plugin-astro"
import svelte from "eslint-plugin-svelte"
import svelteConfig from "./svelte.config.js"

export default tseslint.config(
  { ignores: ["dist/", ".astro/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { parser: tseslint.parser, svelteConfig },
    },
  },
  {
    files: ["scripts/**/*.js", "scripts/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
  {
    // project rule overrides go here
    rules: {},
  },
)
