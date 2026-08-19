<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  label: string
  addLabel?: string
  multiline?: boolean
  required?: boolean
}>(), {
  addLabel: 'Добавить строку',
  multiline: true,
  required: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const update = (index: number, value: string) => {
  const next = [...props.modelValue]
  next[index] = value
  emit('update:modelValue', next)
}

const add = () => emit('update:modelValue', [...props.modelValue, ''])
const remove = (index: number) => emit('update:modelValue', props.modelValue.filter((_, itemIndex) => itemIndex !== index))
const move = (index: number, direction: -1 | 1) => {
  const target = index + direction
  if (target < 0 || target >= props.modelValue.length) return
  const next = [...props.modelValue]
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  emit('update:modelValue', next)
}
</script>

<template>
  <fieldset class="rounded-2xl border border-border bg-canvas p-5">
    <legend class="px-2 font-serif text-2xl">{{ label }}</legend>
    <div class="space-y-4">
      <div v-for="(item, index) in modelValue" :key="index" class="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
        <textarea
          v-if="multiline"
          :value="item"
          rows="4"
          :required="required"
          class="w-full rounded-xl border border-border-strong px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary"
          @input="update(index, ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          :value="item"
          type="text"
          :required="required"
          class="min-h-12 w-full rounded-xl border border-border-strong px-4 text-sm outline-none focus:border-primary"
          @input="update(index, ($event.target as HTMLInputElement).value)"
        >
        <div class="flex flex-col gap-1">
          <button type="button" class="cursor-pointer rounded border border-border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30" :disabled="index === 0" aria-label="Поднять" @click="move(index, -1)">↑</button>
          <button type="button" class="cursor-pointer rounded border border-border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30" :disabled="index === modelValue.length - 1" aria-label="Опустить" @click="move(index, 1)">↓</button>
          <button type="button" class="cursor-pointer rounded border border-red-300 px-2 py-1 text-xs text-red-700 disabled:cursor-not-allowed disabled:opacity-30" :disabled="required && modelValue.length === 1" aria-label="Удалить" @click="remove(index)">×</button>
        </div>
      </div>
      <p v-if="!modelValue.length" class="text-sm text-ink/55">Список пуст.</p>
      <button type="button" class="cursor-pointer rounded-full border border-primary px-4 py-2 text-xs uppercase tracking-[0.12em] text-primary" @click="add">{{ addLabel }}</button>
    </div>
  </fieldset>
</template>
