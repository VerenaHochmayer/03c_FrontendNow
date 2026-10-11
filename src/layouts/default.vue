<template>
  <div class="flex min-h-screen flex-col">
    <LayoutHeader />
    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
