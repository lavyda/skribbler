<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "./ui/Icon.svelte";
  import Sun from "./ui/icons/Sun.svelte";
  import Moon from "./ui/icons/Moon.svelte";

  interface Labels {
    light: string;
    dark: string;
    changeTo: string;
  }

  let { labels }: { labels: Labels } = $props();

  type Scheme = "light" | "dark";

  let override = $state<Scheme | null>(null);
  let systemDark = $state(false);
  let mounted = $state(false);

  let systemScheme = $derived<Scheme>(systemDark ? "dark" : "light");
  let scheme = $derived<Scheme>(override ?? systemScheme);
  let target = $derived<Scheme>(scheme === "dark" ? "light" : "dark");

  onMount(() => {
    const stored = document.documentElement.dataset.theme;
    override = stored === "light" || stored === "dark" ? stored : null;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark = media.matches;
    mounted = true;

    const onChange = (event: MediaQueryListEvent) => (systemDark = event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  });

  function toggle() {
    const next: Scheme = scheme === "dark" ? "light" : "dark";

    if (next === systemScheme) {
      override = null;
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      override = next;
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
    }
  }
</script>

<button type="button" class="theme-toggle" title={`${labels.changeTo} ${target === "dark" ? labels.dark : labels.light}`} onclick={toggle}>
  {#if mounted}<Icon glyph={target === "dark" ? Moon : Sun} />{/if}
</button>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: calc(var(--text-l) + var(--space-xs) * 2);
    block-size: calc(var(--text-l) + var(--space-xs) * 2);
    background: transparent;
    border: none;
    border-radius: var(--space-2xs);
    font-size: var(--text-l);
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background-color: var(--color-surface);
      color: var(--color-accent);
    }
  }
</style>
