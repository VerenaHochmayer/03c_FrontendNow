<script setup lang="ts">
import type { Session } from '~/types/conference'

const props = defineProps<{ session: Session }>()
const { getRoom, getTrack, getSessionSpeakers } = useConferenceData()

const speakerNames = computed(() =>
  getSessionSpeakers(props.session).map(speaker => speaker.name).join(', '),
)
</script>

<template>
  <BaseCard as="article">
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
  </BaseCard>
</template>
