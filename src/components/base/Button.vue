<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'secondary' }>(), {
  variant: 'primary',
})
</script>

<template>
  <button
    type="button"
    class="rounded px-3 py-2 font-heading text-sm"
    :class="variant === 'primary'
      ? 'bg-accent-primary text-on-accent'
      : 'border border-border-strong text-primary'"
  >
    <slot />
  </button>
</template>
