<script setup lang="ts">
import type { Session } from '~/types/conference'

const props = defineProps<{ session: Session }>()
const { getRoom, getTrack, getSessionSpeakers } = useConferenceData()

const speakerNames = computed(() =>
  getSessionSpeakers(props.session).map(speaker => speaker.name).join(', '),
)
</script>

<template>
  <!-- Die ganze Karte ist klickbar (Link über after:inset-0), der Linktext bleibt aber nur der Titel -->
  <BaseCard as="article" padding="sm" class="relative h-full hover:border-border-strong">
    <div class="flex items-start justify-between gap-2">
      <p class="font-heading text-xs text-muted">
        {{ session.startTime }}–{{ session.endTime }}
        <span class="md:hidden">· {{ getRoom(session.roomId)?.name }}</span>
      </p>
      <!-- relative z-10: liegt über dem klickbaren Karten-Link -->
      <MyProgramToggle :session-id="session.id" size="compact" class="relative z-10" />
    </div>
    <h3 class="mt-1 text-sm">
      <NuxtLink
        :to="`/sessions/${session.id}`"
        class="text-primary after:absolute after:inset-0 after:rounded"
      >
        {{ session.title }}
      </NuxtLink>
    </h3>
    <p class="mt-1 text-xs text-muted">{{ speakerNames }}</p>
    <div class="mt-2 flex flex-wrap gap-1">
      <BaseTag variant="secondary">{{ getTrack(session.trackId)?.name }}</BaseTag>
      <BaseTag>{{ session.level }}</BaseTag>
    </div>
  </BaseCard>
</template>
