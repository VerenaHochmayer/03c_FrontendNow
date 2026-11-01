<script setup lang="ts">
import type { Session } from '~/types/conference'

defineProps<{ conflicts: readonly Session[] }>()
</script>

<template>
  <p class="rounded bg-accent-alert px-2 py-1 text-sm text-on-accent">
    Zeitkonflikt mit
    <template v-for="(session, index) in conflicts" :key="session.id">
      <template v-if="index > 0">, </template>
      „{{ session.title }}“
    </template>
  </p>
</template>
