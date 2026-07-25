<script lang="ts">
  import { onMount, tick } from "svelte";
  import { withViewTransition } from "@/lib/transitions/viewTransition";
  import Button from "@/lib/ui/Button.svelte";
  import Icon from "@/lib/ui/Icon.svelte";
  import Sun from "@/lib/ui/icons/Sun.svelte";
  import Moon from "@/lib/ui/icons/Moon.svelte";

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

    withViewTransition(async () => {
      if (next === systemScheme) {
        override = null;
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");
      } else {
        override = next;
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme", next);
      }
      await tick();
    });
  }
</script>

<Button
  variant="ghost"
  icon
  title={`${labels.changeTo} ${target === "dark" ? labels.dark : labels.light}`}
  onclick={toggle}
>
  {#if mounted}<Icon glyph={target === "dark" ? Moon : Sun} />{/if}
</Button>
