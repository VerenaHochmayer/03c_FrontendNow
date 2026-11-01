<script setup lang="ts">
// Rendering: SSG (siehe docs/schritt2/01-rendering-strategie-adr.md)
useSeoMeta({
  title: 'Speaker – FrontendNow',
  description: 'Alle Speaker der FrontendNow mit ihren Vorträgen.',
})
</script>

<template>
  <section>
    <h1 class="text-2xl">Speaker</h1>
    <SpeakersList class="mt-6" />
  </section>
</template>
