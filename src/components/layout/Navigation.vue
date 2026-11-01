<script setup lang="ts">
const links = [
  { to: '/sessions', label: 'Programm' },
  { to: '/speakers', label: 'Speaker' },
  { to: '/mein-programm', label: 'Mein Programm' },
]

const route = useRoute()

// Aktiv ist ein Menüpunkt auch auf seinen Unterseiten, z. B. „Programm“ auf /sessions/s01
const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <nav aria-label="Hauptnavigation">
    <ul class="flex gap-4 font-heading text-sm">
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="link.to"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          :class="isActive(link.to) ? 'bg-accent-primary px-1 text-on-accent' : 'text-primary'"
        >
          {{ link.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
