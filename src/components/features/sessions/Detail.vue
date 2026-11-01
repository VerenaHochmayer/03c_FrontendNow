<script setup lang="ts">
import type { Session } from '~/types/conference'

const props = defineProps<{ session: Session }>()
const { getRoom, getTrack, getSessionSpeakers, formatDay } = useConferenceData()

const speakers = computed(() => getSessionSpeakers(props.session))

// Eckdaten der Session als Beschriftung/Wert-Paare
const facts = computed(() => [
  { label: 'Tag', value: formatDay(props.session.day) },
  { label: 'Zeit', value: `${props.session.startTime}–${props.session.endTime} Uhr` },
  { label: 'Raum', value: getRoom(props.session.roomId)?.name },
  { label: 'Track', value: getTrack(props.session.trackId)?.name },
  { label: 'Level', value: props.session.level },
  { label: 'Format', value: props.session.format },
])
</script>

<template>
  <article>
    <NuxtLink to="/sessions" class="font-heading text-sm">← Zum Programm</NuxtLink>

    <h1 class="mt-4 text-2xl">{{ session.title }}</h1>
    <MyProgramToggle :session-id="session.id" class="mt-4" />

    <BaseCard class="mt-6">
      <dl class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div v-for="fact in facts" :key="fact.label">
          <dt class="text-sm text-muted">{{ fact.label }}</dt>
          <dd class="font-heading">{{ fact.value }}</dd>
        </div>
      </dl>
    </BaseCard>

    <h2 class="mt-8 text-lg">Worum geht es?</h2>
    <p class="mt-2">{{ session.abstract }}</p>

    <h2 class="mt-8 text-lg">Speaker</h2>
    <ul class="mt-2 grid gap-2">
      <li v-for="speaker in speakers" :key="speaker.id">
        <NuxtLink :to="`/speakers/${speaker.id}`">{{ speaker.name }}</NuxtLink>
        <span class="text-sm text-muted"> · {{ speaker.title }}, {{ speaker.company }}</span>
      </li>
    </ul>
  </article>
</template>
