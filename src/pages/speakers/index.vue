<script setup lang="ts">
const { speakers } = useConferenceData()
</script>

<template>
  <section>
    <h1 class="text-2xl">Speaker</h1>
    <ul class="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <li v-for="speaker in speakers" :key="speaker.id">
        <SpeakersCard :speaker="speaker" />
      </li>
    </ul>
  </section>
</template>
