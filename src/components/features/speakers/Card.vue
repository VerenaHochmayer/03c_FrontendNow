<script setup lang="ts">
import type { Speaker } from '~/types/conference'

defineProps<{ speaker: Speaker }>()
</script>

<template>
  <BaseCard as="article">
    <h2 class="text-lg">
      <NuxtLink :to="`/speakers/${speaker.id}`" class="text-primary">{{ speaker.name }}</NuxtLink>
    </h2>
    <p class="text-sm text-muted">{{ speaker.title }} · {{ speaker.company }}</p>
  </BaseCard>
</template>
