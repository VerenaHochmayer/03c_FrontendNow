<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  options: readonly { value: string, label: string }[]
  placeholder?: string
}>(), {
  placeholder: 'Alle',
})

const model = defineModel<string | undefined>()
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm text-muted">{{ label }}</label>
    <select
      :id="id"
      v-model="model"
      class="rounded border border-border-strong bg-surface-raised px-2 py-2 text-sm text-primary"
    >
      <option :value="undefined">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
