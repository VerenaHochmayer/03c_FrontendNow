<script setup lang="ts">
// Hinweis im Header, wenn keine Verbindung besteht (Konzept B, „Schlimmster Fall“).
// Die App funktioniert offline weiter, zeigt aber den zuletzt geladenen Stand.
// Der Status wird erst im Browser gelesen: Das vorgerenderte HTML (SSG) kennt ihn nicht,
// sonst würden Server-HTML und Browser nicht übereinstimmen.
const isOffline = ref(false)

function updateStatus() {
  isOffline.value = !navigator.onLine
}

onMounted(() => {
  updateStatus()
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', updateStatus)
  window.removeEventListener('offline', updateStatus)
})
</script>

<template>
  <!-- role="status": Screenreader sagen den Wechsel an, ohne den Fokus zu verschieben -->
  <p role="status" class="text-sm">
    <span v-if="isOffline" class="rounded bg-accent-secondary px-2 py-1 text-on-accent">
      Offline · zuletzt geladener Stand
    </span>
  </p>
</template>
