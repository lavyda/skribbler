<script module lang="ts">
  export type ButtonVariant = "primary" | "secondary" | "ghost";
</script>

<script lang="ts">
  import type { HTMLAttributes, HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  type ButtonOnly = Omit<HTMLButtonAttributes, keyof HTMLAttributes<HTMLElement> | "disabled">;
  type AnchorOnly = Omit<HTMLAnchorAttributes, keyof HTMLAttributes<HTMLElement>>;

  interface Base extends HTMLAttributes<HTMLElement> {
    variant?: ButtonVariant;
    icon?: boolean;
    disabled?: boolean;
    children: Snippet;
  }

  type Props = Base & (
    | ({ link?: false } & ButtonOnly & Partial<Record<Exclude<keyof AnchorOnly, keyof ButtonOnly>, never>>)
    | ({ link: true } & AnchorOnly & Partial<Record<Exclude<keyof ButtonOnly, keyof AnchorOnly>, never>>)
  );

  let {
    variant = "primary",
    icon = false,
    link = false,
    href,
    type = "button",
    disabled = false,
    class: className,
    children,
    ...rest
  }: Props = $props();

  const classes = $derived(["btn", `btn--${variant}`, icon && "btn--icon", className]);
</script>

{#if link}
  <a
    {...rest}
    class={classes}
    href={disabled ? undefined : href}
    aria-disabled={disabled ? "true" : undefined}
    tabindex={disabled ? -1 : undefined}
  >{@render children()}</a>
{:else}
  <button {...rest} class={classes} type={type as HTMLButtonAttributes['type']} {disabled}>{@render children()}</button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding-block: var(--space-xs);
    padding-inline: var(--space-s);
    border: 1px solid transparent;
    border-radius: var(--radius-2xs);
    font: inherit;
    font-size: var(--text-m);
    font-weight: var(--weight-semibold);
    line-height: 1;
    cursor: pointer;
    text-decoration: none;
  }

  .btn:hover,
  .btn:focus-visible {
    text-decoration: none;
  }

  .btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn--primary {
    background-color: var(--color-accent);
    color: var(--color-on-accent);
  }

  .btn--primary:hover {
    background-color: color-mix(in oklab, var(--color-accent), var(--color-bg) 15%);
  }

  .btn--secondary {
    background-color: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
  }

  .btn--ghost {
    background-color: transparent;
    color: var(--color-text);
  }

  .btn--secondary:hover,
  .btn--ghost:hover,
  .btn--ghost:focus-visible {
    background-color: var(--color-border);
    color: var(--color-accent);
  }

  .btn--icon {
    padding: 0;
    inline-size: calc(var(--text-l) + var(--space-xs) * 2);
    block-size: calc(var(--text-l) + var(--space-xs) * 2);
    font-size: var(--text-l);
  }

  @media (prefers-reduced-motion: no-preference) {
    .btn {
      transition:
        scale 160ms ease,
        background-color 160ms ease,
        color 160ms ease;
    }

    .btn:not(:disabled, [aria-disabled="true"]):hover {
      scale: 1.04;
    }

    .btn:not(:disabled, [aria-disabled="true"]):active {
      scale: 0.97;
      transition-duration: 80ms;
    }
  }
</style>
