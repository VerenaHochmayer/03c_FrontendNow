<script setup lang="ts">
// Rendering: CSR, die gemerkten IDs gibt es nur im localStorage des Browsers
// (siehe docs/schritt2/01-rendering-strategie-adr.md)
const { sessions } = useMyProgram()
const { filters, filteredSessions, activeCount, setFilter, resetFilters } = useSessionFilter(sessions)

useSeoMeta({ title: 'Mein Programm – FrontendNow' })
</script>

<template>
  <section>
    <h1 class="text-2xl">Mein Programm</h1>

    <MyProgramEmptyState v-if="sessions.length === 0" class="mt-6" />

    <template v-else>
      <SessionsFilterBar
        class="mt-6"
        :filters="filters"
        :active-count="activeCount"
        @update="setFilter"
        @reset="resetFilters"
      />

      <p class="mt-6 text-sm text-muted" aria-live="polite">
        {{ filteredSessions.length }} von {{ sessions.length }} gemerkten Sessions
      </p>

      <MyProgramTimetable
        v-if="filteredSessions.length > 0"
        class="mt-4"
        :sessions="filteredSessions"
      />
      <BaseCard v-else padding="lg" class="mt-4">
        <p>Keine deiner gemerkten Sessions passt zu allen gewählten Filtern.</p>
        <BaseButton class="mt-3" @click="resetFilters">Filter zurücksetzen</BaseButton>
      </BaseCard>
    </template>
  </section>
</template>
