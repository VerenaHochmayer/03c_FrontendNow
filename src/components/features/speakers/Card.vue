<script setup lang="ts">
import type { Speaker } from '~/types/conference'

const props = defineProps<{ speaker: Speaker }>()
const { getSessionsBySpeaker } = useConferenceData()

const talkCount = computed(() => getSessionsBySpeaker(props.speaker.id).length)
</script>

<template>
  <!-- Die ganze Karte ist klickbar (Link über after:inset-0), der Linktext bleibt aber nur der Name -->
  <BaseCard as="article" class="relative h-full hover:border-border-strong">
    <h2 class="text-lg">
      <NuxtLink
        :to="`/speakers/${speaker.id}`"
        class="text-primary after:absolute after:inset-0 after:rounded"
      >
        {{ speaker.name }}
      </NuxtLink>
    </h2>
    <p class="text-sm text-muted">{{ speaker.title }} · {{ speaker.company }}</p>
    <p class="mt-2 text-sm text-muted">
      {{ talkCount === 1 ? '1 Vortrag' : `${talkCount} Vorträge` }}
    </p>
  </BaseCard>
</template>
