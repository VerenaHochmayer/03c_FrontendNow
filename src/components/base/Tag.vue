<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'secondary' | 'neutral' }>(), {
  variant: 'neutral',
})
</script>

<template>
  <span
    class="inline-block rounded px-2 text-xs"
    :class="variant === 'secondary'
      ? 'bg-accent-secondary text-on-accent'
      : 'border border-border text-muted'"
  >
    <slot />
  </span>
</template>
