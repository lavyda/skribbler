<script lang="ts">
  import { onMount } from "svelte";
  import Select, { type SelectOption } from "./ui/Select.svelte";
  import Icon from "./ui/Icon.svelte";
  import MonitorCog from "./ui/icons/MonitorCog.svelte";
  import Sun from "./ui/icons/Sun.svelte";
  import Moon from "./ui/icons/Moon.svelte";

  interface Labels {
    system: string;
    light: string;
    dark: string;
    themes: string;
  }

  let { labels }: { labels: Labels } = $props();

  type Theme = "system" | "light" | "dark";

  let theme = $state<Theme>("system");

  let options: SelectOption[] = $derived([
    { label: labels.system, value: "system", icon: { glyph: MonitorCog } },
    { label: labels.light, value: "light", icon: { glyph: Sun } },
    { label: labels.dark, value: "dark", icon: { glyph: Moon } },
  ]);

  onMount(() => {
    theme = (document.documentElement.dataset.theme as Theme | undefined) ?? "system";
  });

  function setTheme(value: Theme) {
    theme = value;
    if (value === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.dataset.theme = value;
      localStorage.setItem("theme", value);
    }
  }
</script>

<Select id="themes" ariaLabel={labels.themes} {options} value={theme} onchange={(value) => setTheme(value as Theme)}>
  {#snippet selected(opt)}
    {#if opt?.icon}<Icon {...opt.icon} title={opt.label} />{/if}
  {/snippet}
</Select>
