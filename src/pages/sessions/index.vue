<script setup lang="ts">
// Platzhalter: Wird zum Timetable (SessionsTimetable) mit SessionsFilterBar ausgebaut.
const { conference, getSessionsByDay, formatDay } = useConferenceData()
</script>

<template>
  <section>
    <h1 class="text-2xl">Programm</h1>
    <div v-for="day in conference.dates" :key="day" class="mt-8">
      <h2 class="text-lg">{{ formatDay(day) }}</h2>
      <ul class="mt-4 grid gap-4 sm:grid-cols-2">
        <li v-for="session in getSessionsByDay(day)" :key="session.id">
          <SessionsCard :session="session" />
        </li>
      </ul>
    </div>
  </section>
</template>
