<script module lang="ts">
  import type { ComponentProps } from "svelte";
  import Icon from "./Icon.svelte";

  export interface SelectOption<Meta = unknown> {
    value: string;
    label: string;
    disabled?: boolean;
    ariaLabel?: string;
    icon?: ComponentProps<typeof Icon>;
    meta?: Meta;
  }
</script>

<script lang="ts" generics="Meta = unknown">
  import type { Snippet } from "svelte";

  interface Props {
    id: string;
    options: SelectOption<Meta>[];
    name?: string;
    label?: string;
    ariaLabel?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    selected?: Snippet<[SelectOption<Meta> | undefined]>;
    option?: Snippet<[SelectOption<Meta>]>;
    onchange?: (value: string, option: SelectOption<Meta> | undefined) => void;
  }

  let {
    id,
    options,
    name,
    label,
    ariaLabel,
    value,
    required,
    disabled,
    selected,
    option,
    onchange,
  }: Props = $props();

  const selectedOption = $derived(options?.find((opt) => opt.value === value));

  function handleChange(event: Event & { currentTarget: HTMLSelectElement }) {
    const next = event.currentTarget.value;
    onchange?.(next, options.find((opt) => opt.value === next));
  }
</script>

<div class="select-field">
  {#if label}
    <label for={id} class="select-field__label">{label}</label>
  {/if}

  <select class="select" {id} {name} aria-label={ariaLabel} {required} {disabled} onchange={handleChange}>
    <button type="button">
      {#if selected}{@render selected(selectedOption)}{:else}<selectedcontent></selectedcontent>{/if}
    </button>

    {#each options ?? [] as opt (opt.value)}
      <option
        value={opt.value}
        selected={opt.value === value}
        disabled={opt.disabled}
        aria-label={opt.ariaLabel}
      >
        {#if option}{@render option(opt)}{:else}
          {#if opt.icon}<Icon {...opt.icon} />{/if}
          {opt.label}
        {/if}
      </option>
    {/each}
  </select>
</div>

<style>
  .select-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .select-field__label {
    font-size: var(--text-s);
    color: var(--color-text-muted);
  }

  .select,
  .select::picker(select) {
    appearance: base-select;
  }

  .select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-xs);
    width: 100%;
    padding-block: var(--space-xs);
    padding-inline: var(--space-s);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xs);
    font-size: var(--text-m);
    cursor: pointer;
  }

  .select:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    background: var(--color-surface);
  }

  .select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select::picker(select) {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xs);
    padding: var(--space-2xs);
    min-width: anchor-size(width);
    margin-block-start: var(--space-2xs);
    box-shadow: 0 var(--space-2xs) var(--space-m) rgb(0 0 0 / 0.12);
  }

  .select::picker-icon {
    color: var(--color-text-muted);
  }

  .select:open::picker-icon {
    rotate: 180deg;
  }

  @media (prefers-reduced-motion: no-preference) {
    .select::picker-icon {
      transition: rotate 150ms ease;
    }
  }

  .select option {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding-block: var(--space-2xs);
    padding-inline: var(--space-xs);
    border-radius: var(--radius-2xs);
    cursor: pointer;
  }

  .select option:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select option::checkmark {
    display: none;
  }

  .select option:hover,
  .select option:focus {
    background: var(--color-surface);
  }

  .select option:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: -2px;
  }

  .select option:checked {
    background: var(--color-accent);
    color: var(--color-on-accent);
    font-weight: var(--weight-semibold);
  }
</style>
