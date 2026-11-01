<script setup lang="ts">
import type { Session } from '~/types/conference'

const props = defineProps<{ sessions: readonly Session[] }>()
const { conference, rooms, formatDay } = useConferenceData()

// Pro Tag: Zeilen = Startzeiten, Spalten = Räume.
// Tage und Zeitslots ohne passende Session werden ausgeblendet.
const days = computed(() =>
  conference.value.dates
    .map((day) => {
      const daySessions = props.sessions.filter(session => session.day === day)
      const slots = [...new Set(daySessions.map(session => session.startTime))].sort()
      return {
        day,
        slots: slots.map(time => ({
          time,
          sessions: daySessions.filter(session => session.startTime === time),
        })),
      }
    })
    .filter(day => day.slots.length > 0),
)

// Spalte im Raster: 1 = Uhrzeit, ab 2 = Räume in Datensatz-Reihenfolge
const roomColumn = (roomId: string) => rooms.value.findIndex(room => room.id === roomId) + 2
</script>

<template>
  <div
    class="flex flex-col gap-8"
    :style="{ '--rooms': rooms.length }"
  >
    <section v-for="{ day, slots } in days" :key="day">
      <h2 class="text-lg">{{ formatDay(day) }}</h2>

      <!-- Kopfzeile mit Räumen nur auf breiten Bildschirmen, auf dem Handy steht der Raum in der Karte -->
      <div
        class="mt-4 hidden gap-2 font-heading text-sm text-muted md:grid md:grid-cols-[5rem_repeat(var(--rooms),minmax(0,1fr))]"
        aria-hidden="true"
      >
        <span />
        <span v-for="room in rooms" :key="room.id">{{ room.name }}</span>
      </div>

      <div
        v-for="slot in slots"
        :key="slot.time"
        class="mt-2 grid gap-2 md:grid-cols-[5rem_repeat(var(--rooms),minmax(0,1fr))]"
      >
        <p class="pt-3 font-heading text-sm md:col-start-1">{{ slot.time }}</p>
        <SessionsTimetableEntry
          v-for="session in slot.sessions"
          :key="session.id"
          :session="session"
          class="md:col-start-(--column)"
          :style="{ '--column': roomColumn(session.roomId) }"
        />
      </div>
    </section>
  </div>
</template>
