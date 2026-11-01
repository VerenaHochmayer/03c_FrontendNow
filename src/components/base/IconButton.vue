<script setup lang="ts">
// Button nur mit Symbol: das Label ist Pflicht, damit Screenreader ihn benennen können
withDefaults(defineProps<{
  label: string
  variant?: 'primary' | 'secondary'
}>(), {
  variant: 'secondary',
})
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    class="inline-flex size-8 items-center justify-center rounded border"
    :class="variant === 'primary'
      ? 'border-primary bg-accent-primary text-on-accent'
      : 'border-border-strong bg-surface-raised text-primary'"
  >
    <slot />
  </button>
</template>
