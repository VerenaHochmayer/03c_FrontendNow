<script setup lang="ts">
withDefaults(defineProps<{
  as?: 'div' | 'article' | 'section'
  padding?: 'sm' | 'md' | 'lg'
}>(), {
  as: 'div',
  padding: 'md',
})

const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-6' }
</script>

<template>
  <component
    :is="as"
    class="rounded border border-border bg-surface-raised"
    :class="paddings[padding]"
  >
    <slot />
  </component>
</template>
