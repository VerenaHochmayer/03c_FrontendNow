<script setup lang="ts">
import type { Session } from '~/types/conference'

const props = defineProps<{ session: Session }>()
const { getRoom, getTrack, getSpeaker } = useConferenceData()

const speakerNames = computed(() =>
  props.session.speakerIds.map(id => getSpeaker(id)?.name).filter(Boolean).join(', '),
)
</script>

<template>
  <article class="rounded border border-border bg-surface-raised p-4">
    <p class="font-heading text-sm text-muted">
      {{ session.startTime }}–{{ session.endTime }} · {{ getRoom(session.roomId)?.name }}
    </p>
    <h3 class="mt-1 text-lg">
      <NuxtLink :to="`/sessions/${session.id}`" class="text-primary">
        {{ session.title }}
      </NuxtLink>
    </h3>
    <p class="mt-1 text-sm text-muted">{{ speakerNames }}</p>
    <div class="mt-3 flex flex-wrap gap-2">
      <BaseTag variant="secondary">{{ getTrack(session.trackId)?.name }}</BaseTag>
      <BaseTag>{{ session.level }}</BaseTag>
      <BaseTag>{{ session.format }}</BaseTag>
    </div>
  </article>
</template>
