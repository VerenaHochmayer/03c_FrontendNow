<script setup lang="ts">
// Darstellung von „Zu Mein Programm hinzufügen/entfernen“. Die Logik liegt in
// useMyProgram() (Headless-Entscheidung, siehe Architektur-ADR).
const props = withDefaults(defineProps<{
  sessionId: string
  size?: 'compact' | 'default'
}>(), {
  size: 'default',
})

const { isInProgram, toggle } = useMyProgram()
const { getSession } = useConferenceData()

const saved = computed(() => isInProgram(props.sessionId))
const title = computed(() => getSession(props.sessionId)?.title ?? 'Session')
</script>

<template>
  <!-- Nur im Browser rendern: Die Seiten sind vorab erzeugt (SSG) und kennen den
       localStorage nicht (siehe Rendering-ADR). Der Platzhalter verhindert Layoutsprünge. -->
  <ClientOnly>
    <BaseIconButton
      v-if="size === 'compact'"
      :label="saved ? `„${title}“ aus Mein Programm entfernen` : `„${title}“ zu Mein Programm hinzufügen`"
      :variant="saved ? 'primary' : 'secondary'"
      :aria-pressed="saved"
      @click="toggle(sessionId)"
    >
      <span aria-hidden="true">{{ saved ? '★' : '☆' }}</span>
    </BaseIconButton>
    <BaseButton
      v-else
      :variant="saved ? 'primary' : 'secondary'"
      :aria-pressed="saved"
      @click="toggle(sessionId)"
    >
      <span aria-hidden="true">{{ saved ? '★' : '☆' }}</span>
      {{ saved ? 'In Mein Programm' : 'Zu Mein Programm hinzufügen' }}
    </BaseButton>

    <!-- Unsichtbarer Platzhalter in exakt derselben Größe -->
    <template #fallback>
      <span class="invisible" aria-hidden="true">
        <BaseIconButton v-if="size === 'compact'" label="" tabindex="-1">☆</BaseIconButton>
        <BaseButton v-else variant="secondary" tabindex="-1">☆ Zu Mein Programm hinzufügen</BaseButton>
      </span>
    </template>
  </ClientOnly>
</template>
