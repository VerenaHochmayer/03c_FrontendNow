<script setup lang="ts">
// Platzhalter für die Infokarte eines Speakers (SpeakersProfile)
const route = useRoute()
const { getSpeaker, getSessionsBySpeaker } = useConferenceData()

const speaker = getSpeaker(String(route.params.id))
if (!speaker) {
  throw createError({ statusCode: 404, statusMessage: 'Speaker nicht gefunden' })
}
const talks = getSessionsBySpeaker(speaker.id)
</script>

<template>
  <article v-if="speaker">
    <h1 class="text-2xl">{{ speaker.name }}</h1>
    <p class="mt-1 text-muted">{{ speaker.title }} · {{ speaker.company }}</p>
    <p class="mt-6">{{ speaker.bio }}</p>

    <h2 class="mt-8 text-lg">Vorträge</h2>
    <ul class="mt-4 grid gap-4">
      <li v-for="session in talks" :key="session.id">
        <SessionsCard :session="session" />
      </li>
    </ul>
  </article>
</template>
