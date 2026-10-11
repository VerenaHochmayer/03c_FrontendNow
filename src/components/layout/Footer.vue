<script setup lang="ts">
const { conference } = useConferenceData()
</script>

<template>
  <footer class="border-t border-border">
    <p class="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted">
      {{ conference.name }} · {{ conference.location }} · Team ClubMates
    </p>
  </footer>
</template>
