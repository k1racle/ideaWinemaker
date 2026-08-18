<script setup lang="ts">
type InputMode = 'decimal' | 'integer' | 'range'

const props = withDefaults(defineProps<{
  modelValue: string
  label: string
  suffix: string
  joiner?: string
  placeholder?: string
  mode?: InputMode
  required?: boolean
}>(), {
  joiner: '',
  placeholder: '',
  mode: 'decimal',
  required: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const stripSuffix = (value: string) => value.replace(new RegExp(`\\s*${escapePattern(props.suffix)}\\s*$`, 'u'), '')
const sanitize = (value: string) => {
  if (props.mode === 'integer') return value.replace(/\D/g, '')
  if (props.mode === 'range') return value.replace(/[^\d.,+\-–—]/g, '')
  return value.replace(/[^\d.,]/g, '')
}
const inputValue = computed(() => sanitize(stripSuffix(props.modelValue)))

const update = (event: Event) => {
  const input = event.target as HTMLInputElement
  const numericValue = sanitize(input.value)
  input.value = numericValue
  emit('update:modelValue', numericValue ? `${numericValue}${props.joiner}${props.suffix}` : '')
}

const normalizeRange = () => {
  if (props.mode !== 'range') return
  const numericValue = inputValue.value.replace(/(\d)[-—](?=\d)/g, '$1–')
  emit('update:modelValue', numericValue ? `${numericValue}${props.joiner}${props.suffix}` : '')
}
</script>

<template>
  <label class="block">
    <span class="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-primary">{{ label }}</span>
    <span class="flex min-h-12 overflow-hidden rounded-xl border border-border-strong bg-canvas transition focus-within:border-primary">
      <input
        :value="inputValue"
        type="text"
        :inputmode="mode === 'integer' ? 'numeric' : 'decimal'"
        :required="required"
        :placeholder="placeholder"
        class="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
        @input="update"
        @blur="normalizeRange"
      >
      <span class="flex items-center border-l border-border bg-surface px-4 text-sm font-medium text-ink/65" aria-hidden="true">{{ suffix }}</span>
    </span>
  </label>
</template>
