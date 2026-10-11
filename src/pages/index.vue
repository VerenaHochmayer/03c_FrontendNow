<script setup lang="ts">
const { conference, sessions, speakers, tracks, rooms } = useConferenceData()

const dateFormat = new Intl.DateTimeFormat('de-AT', { day: 'numeric', month: 'long', year: 'numeric' })
const dates = conference.dates.map(d => dateFormat.format(new Date(d))).join(' & ')

const stats = [
  { label: 'Sessions', value: sessions.length },
  { label: 'Speaker', value: speakers.length },
  { label: 'Tracks', value: tracks.length },
  { label: 'Räume', value: rooms.length },
]
</script>

<template>
  <section>
    <p class="font-heading text-sm text-muted">{{ dates }} · {{ conference.location }}</p>
    <h1 class="mt-2 text-3xl">{{ conference.name }}</h1>
    <p class="mt-2 text-lg">{{ conference.tagline }}</p>

    <dl class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded border border-border bg-surface-raised p-4">
        <dt class="text-sm text-muted">{{ stat.label }}</dt>
        <dd class="font-heading text-2xl">{{ stat.value }}</dd>
      </div>
    </dl>

    <NuxtLink
      to="/sessions"
      class="mt-8 inline-block rounded bg-accent-primary px-4 py-2 font-heading text-on-accent no-underline hover:no-underline"
    >
      Zum Programm
    </NuxtLink>
  </section>
</template>
