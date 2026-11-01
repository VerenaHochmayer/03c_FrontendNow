<script setup lang="ts">
// Rendering: SSG + Filtern im Browser (siehe docs/schritt2/01-rendering-strategie-adr.md)
const { sessions } = useConferenceData()
const { filters, filteredSessions, activeCount, setFilter, resetFilters } = useSessionFilter(sessions)
</script>

<template>
  <section>
    <h1 class="text-2xl">Programm</h1>

    <SessionsFilterBar
      class="mt-6"
      :filters="filters"
      :active-count="activeCount"
      @update="setFilter"
      @reset="resetFilters"
    />

    <p class="mt-6 text-sm text-muted" aria-live="polite">
      {{ filteredSessions.length }} von {{ sessions.length }} Sessions
    </p>

    <SessionsTimetable
      v-if="filteredSessions.length > 0"
      class="mt-4"
      :sessions="filteredSessions"
    />
    <BaseCard v-else padding="lg" class="mt-4">
      <p>Keine Session passt zu allen gewählten Filtern.</p>
      <BaseButton class="mt-3" @click="resetFilters">Filter zurücksetzen</BaseButton>
    </BaseCard>
  </section>
</template>
