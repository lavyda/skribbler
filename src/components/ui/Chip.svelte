<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    href?: string;
    disabled?: boolean;
    children: Snippet;
  }

  let { href, disabled = false, children }: Props = $props();
</script>

{#if href}
  <a
    class="chip"
    href={disabled ? undefined : href}
    aria-disabled={disabled ? "true" : undefined}
    tabindex={disabled ? -1 : undefined}
  >{@render children()}</a>
{:else}
  <button class="chip" type="button" {disabled}>{@render children()}</button>
{/if}

<style>
  .chip {
    display: inline-block;
    padding: var(--space-2xs) var(--space-xs);
    border: none;
    border-radius: var(--space-xs);
    background-color: var(--color-surface);
    background-color: color-mix(in srgb, var(--color-surface) 60%, transparent);
    color: var(--color-text-muted);
    font-family: var(--font-monospace);
    font-size: var(--text-xs);
    line-height: 1;
    cursor: pointer;
    text-decoration: none;
  }

  .chip:hover,
  .chip:focus-visible {
    color: var(--color-text);
    background-color: var(--color-surface);
  }

  .chip:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .chip:disabled,
  .chip[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: no-preference) {
    .chip {
      transition: color 160ms ease, background-color 160ms ease;
    }
  }
</style>
