<script setup lang="ts">
// Rendering: SSG, alle 20 Infokarten werden beim Build erzeugt
// (siehe docs/schritt2/01-rendering-strategie-adr.md)
const route = useRoute()
const { getSession } = useConferenceData()

const session = getSession(String(route.params.id))
if (!session) {
  throw createError({ statusCode: 404, statusMessage: 'Session nicht gefunden', fatal: true })
}

// Eigener Titel und Beschreibung pro Infokarte, damit sie in Suchmaschinen auffindbar ist
useSeoMeta({
  title: `${session.title} – FrontendNow`,
  description: session.abstract,
})
</script>

<template>
  <SessionsDetail :session="session" />
</template>
