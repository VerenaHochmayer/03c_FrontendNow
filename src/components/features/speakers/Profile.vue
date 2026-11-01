<script setup lang="ts">
import type { Speaker } from '~/types/conference'

const props = defineProps<{ speaker: Speaker }>()
const { getSessionsBySpeaker, formatDay } = useConferenceData()

// Vorträge nach Tag gruppiert, da SessionsCard nur Uhrzeit und Raum zeigt
// und manche Speaker an beiden Konferenztagen sprechen
const talksByDay = computed(() => {
  const talks = getSessionsBySpeaker(props.speaker.id)
  const days = [...new Set(talks.map(session => session.day))]
  return days.map(day => ({
    day,
    sessions: talks.filter(session => session.day === day),
  }))
})
</script>

<template>
  <article>
    <NuxtLink to="/speakers" class="font-heading text-sm">← Alle Speaker</NuxtLink>

    <h1 class="mt-4 text-2xl">{{ speaker.name }}</h1>
    <p class="mt-1 text-muted">{{ speaker.title }} · {{ speaker.company }}</p>
    <p class="mt-6">{{ speaker.bio }}</p>

    <h2 class="mt-8 text-lg">Vorträge</h2>
    <section v-for="{ day, sessions } in talksByDay" :key="day" class="mt-4">
      <h3 class="font-heading text-sm text-muted">{{ formatDay(day) }}</h3>
      <ul class="mt-2 grid gap-4">
        <li v-for="session in sessions" :key="session.id">
          <SessionsCard :session="session" />
        </li>
      </ul>
    </section>
  </article>
</template>
