<script setup lang="ts">
import type { FilterKey, SessionFilters } from '~/composables/useSessionFilter'

defineProps<{ filters: SessionFilters, activeCount: number }>()
const emit = defineEmits<{
  update: [key: FilterKey, value: string | undefined]
  reset: []
}>()

const { filterOptions, formatDay } = useConferenceData()

// Reihenfolge der Filter in der Leiste: vom Groben (Tag) zum Feinen (Speaker)
const fields = computed(() => {
  const options = filterOptions.value
  return [
    { key: 'day', label: 'Tag', options: options.days.map(day => ({ value: day, label: formatDay(day) })) },
    { key: 'time', label: 'Uhrzeit', options: options.timeSlots.map(time => ({ value: time, label: `ab ${time}` })) },
    { key: 'room', label: 'Raum', options: options.rooms.map(room => ({ value: room.id, label: room.name })) },
    { key: 'track', label: 'Track', options: options.tracks.map(track => ({ value: track.id, label: track.name })) },
    { key: 'level', label: 'Level', options: options.levels.map(level => ({ value: level, label: level })) },
    { key: 'speaker', label: 'Speaker', options: options.speakers.map(speaker => ({ value: speaker.id, label: speaker.name })) },
  ] satisfies { key: FilterKey, label: string, options: { value: string, label: string }[] }[]
})
</script>

<template>
  <section aria-label="Programm filtern">
    <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <BaseSelect
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
        :options="field.options"
        :model-value="filters[field.key]"
        @update:model-value="emit('update', field.key, $event)"
      />
    </div>
    <BaseButton
      v-if="activeCount > 0"
      variant="secondary"
      class="mt-3"
      @click="emit('reset')"
    >
      Filter zurücksetzen ({{ activeCount }})
    </BaseButton>
  </section>
</template>
