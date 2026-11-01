<script setup lang="ts">
import type { Session } from '~/types/conference'

// Persönlicher Zeitplan: gemerkte Sessions chronologisch pro Tag
const props = defineProps<{ sessions: readonly Session[] }>()
const { conference, getRoom, getTrack, formatDay } = useConferenceData()
const { conflicts } = useMyProgram()

const days = computed(() =>
  conference.value.dates
    .map(day => ({ day, sessions: props.sessions.filter(session => session.day === day) }))
    .filter(day => day.sessions.length > 0),
)
</script>

<template>
  <div class="flex flex-col gap-8">
    <section v-for="{ day, sessions: daySessions } in days" :key="day">
      <h2 class="text-lg">{{ formatDay(day) }}</h2>
      <ol class="mt-4 grid gap-3">
        <li v-for="session in daySessions" :key="session.id">
          <BaseCard as="article" class="flex items-start gap-4">
            <p class="shrink-0 whitespace-nowrap font-heading text-sm">
              {{ session.startTime }}–{{ session.endTime }}
            </p>
            <div class="min-w-0 flex-1">
              <h3 class="text-base">
                <NuxtLink :to="`/sessions/${session.id}`" class="text-primary">
                  {{ session.title }}
                </NuxtLink>
              </h3>
              <p class="mt-1 text-sm text-muted">
                {{ getRoom(session.roomId)?.name }} · {{ getTrack(session.trackId)?.name }}
              </p>
              <MyProgramConflictHint
                v-if="conflicts.get(session.id)"
                class="mt-2"
                :conflicts="conflicts.get(session.id) ?? []"
              />
            </div>
            <MyProgramToggle :session-id="session.id" size="compact" />
          </BaseCard>
        </li>
      </ol>
    </section>
  </div>
</template>
