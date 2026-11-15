<script setup lang="ts">
const { conference } = useConferenceData()
</script>

<template>
  <header class="border-b border-border bg-surface-raised">
    <div class="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
      <NuxtLink to="/" class="font-heading text-lg font-semibold text-primary no-underline hover:no-underline">
        <span class="bg-accent-primary px-1 text-on-accent">Frontend</span>Now
        <span class="sr-only">– {{ conference.tagline }}</span>
      </NuxtLink>
      <div class="flex flex-wrap items-center gap-4">
        <LayoutOfflineBadge />
        <LayoutNavigation />
      </div>
    </div>
  </header>
</template>
