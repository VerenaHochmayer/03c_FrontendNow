<script setup lang="ts">
const { speakers } = useConferenceData()

// Alphabetisch nach Name, damit man Speaker schnell findet
const sortedSpeakers = computed(() =>
  [...speakers.value].sort((a, b) => a.name.localeCompare(b.name, 'de')),
)
</script>

<template>
  <ul class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
    <li v-for="speaker in sortedSpeakers" :key="speaker.id">
      <SpeakersCard :speaker="speaker" />
    </li>
  </ul>
</template>
