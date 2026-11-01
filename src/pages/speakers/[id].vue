<script setup lang="ts">
// Rendering: SSG, alle 18 Profile werden beim Build erzeugt
// (siehe docs/schritt2/01-rendering-strategie-adr.md)
const route = useRoute()
const { getSpeaker } = useConferenceData()

const speaker = getSpeaker(String(route.params.id))
if (!speaker) {
  throw createError({ statusCode: 404, statusMessage: 'Speaker nicht gefunden', fatal: true })
}

// Eigener Titel und Beschreibung pro Profil, damit es in Suchmaschinen auffindbar ist
useSeoMeta({
  title: `${speaker.name} – FrontendNow`,
  description: speaker.bio,
})
</script>

<template>
  <SpeakersProfile :speaker="speaker" />
</template>
