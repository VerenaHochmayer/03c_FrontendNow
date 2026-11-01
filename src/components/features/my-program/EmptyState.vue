<template>
  <BaseCard padding="lg">
    <p>Du hast dir noch keine Sessions gemerkt.</p>
    <p class="mt-2 text-sm text-muted">
      Tippe im Programm, auf einer Session oder bei einem Speaker auf ☆,
      um eine Session hinzuzufügen. Dein Programm ist danach auch offline verfügbar.
    </p>
    <NuxtLink
      to="/sessions"
      class="mt-4 inline-block rounded bg-accent-primary px-3 py-2 font-heading text-sm text-on-accent no-underline hover:no-underline"
    >
      Zum Programm
    </NuxtLink>
  </BaseCard>
</template>
