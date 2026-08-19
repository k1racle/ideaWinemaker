<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  label: string
  multiline?: boolean
  rows?: number
  placeholder?: string
  required?: boolean
}>(), {
  multiline: false,
  rows: 4,
  placeholder: '',
  required: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="block">
    <span class="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-primary">{{ label }}</span>
    <textarea
      v-if="multiline"
      :value="modelValue"
      :rows="rows"
      :required="required"
      :placeholder="placeholder"
      class="w-full rounded-xl border border-border-strong bg-canvas px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-primary"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :value="modelValue"
      type="text"
      :required="required"
      :placeholder="placeholder"
      class="min-h-12 w-full rounded-xl border border-border-strong bg-canvas px-4 text-sm outline-none transition focus:border-primary"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </label>
</template>
