<script setup lang="ts">
const links = [
  { to: '/sessions', label: 'Programm' },
  { to: '/speakers', label: 'Speaker' },
  { to: '/mein-programm', label: 'Mein Programm' },
]
</script>

<template>
  <nav aria-label="Hauptnavigation">
    <ul class="flex gap-4 font-heading text-sm">
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="text-primary"
          active-class="bg-accent-primary px-1 text-on-accent"
        >
          {{ link.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
