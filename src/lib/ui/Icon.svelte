<script lang="ts">
  import type { Component } from "svelte";
  import type { SVGAttributes } from "svelte/elements";

  interface Props extends Omit<SVGAttributes<SVGSVGElement>, "name"> {
    glyph: Component<SVGAttributes<SVGSVGElement>>;
    size?: number | string;
    title?: string;
  }

  let { glyph: Glyph, size = "1em", title, class: className, ...rest }: Props = $props();
</script>

<Glyph
  width={size}
  height={size}
  class={["icon", className]}
  role={title ? "img" : undefined}
  aria-label={title}
  aria-hidden={title ? undefined : "true"}
  {...rest}
/>

<style>
  :global(.icon) {
    display: inline-block;
    flex: none;
    vertical-align: middle;
  }
</style>
