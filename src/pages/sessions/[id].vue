<script setup lang="ts">
// Platzhalter für die Infokarte eines Events (SessionsDetail)
const route = useRoute()
const { getSession, getSpeaker, getRoom, getTrack } = useConferenceData()

const session = getSession(String(route.params.id))
if (!session) {
  throw createError({ statusCode: 404, statusMessage: 'Session nicht gefunden' })
}
</script>

<template>
  <article v-if="session">
    <p class="font-heading text-sm text-muted">
      {{ session.day }} · {{ session.startTime }}–{{ session.endTime }} · {{ getRoom(session.roomId)?.name }}
    </p>
    <h1 class="mt-2 text-2xl">{{ session.title }}</h1>
    <div class="mt-3 flex flex-wrap gap-2">
      <BaseTag variant="secondary">{{ getTrack(session.trackId)?.name }}</BaseTag>
      <BaseTag>{{ session.level }}</BaseTag>
      <BaseTag>{{ session.format }}</BaseTag>
    </div>
    <p class="mt-6">{{ session.abstract }}</p>
    <h2 class="mt-8 text-lg">Speaker</h2>
    <ul class="mt-2">
      <li v-for="id in session.speakerIds" :key="id">
        <NuxtLink :to="`/speakers/${id}`">{{ getSpeaker(id)?.name }}</NuxtLink>
      </li>
    </ul>
  </article>
</template>
