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
  <span class="chip">{@render children()}</span>
{/if}

<style>
  .chip {
    display: inline-block;
    box-sizing: border-box;
    padding: var(--space-2xs) var(--space-xs);
    border: 1px solid var(--color-text-muted);
    border-radius: var(--radius-xs);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-family: var(--font-monospace);
    font-size: var(--text-xs);
    line-height: 1;
    text-decoration: none;
  }

  a.chip {
    cursor: pointer;
  }

  a.chip:hover,
  a.chip:focus-visible {
    border-color: var(--color-text);
    background-color: var(--color-border);
  }

  a.chip:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  a.chip[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: no-preference) {
    a.chip {
      transition: color 160ms ease, background-color 160ms ease;
    }
  }
</style>
