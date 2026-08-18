<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  label: string
  placeholder?: string
}>(), {
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const draft = ref(props.modelValue.join(', '))
const editing = ref(false)

const parse = (value: string) => value.split(/,|\r?\n/).map(item => item.trim())

watch(() => props.modelValue, (items) => {
  if (!editing.value) draft.value = items.join(', ')
}, { deep: true })

const update = (event: Event) => {
  draft.value = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', parse(draft.value))
}

const normalize = () => {
  editing.value = false
  const items = parse(draft.value).filter(Boolean)
  draft.value = items.join(', ')
  emit('update:modelValue', items)
}
</script>

<template>
  <label class="mt-4 block rounded-2xl border border-border bg-canvas p-5">
    <span class="block font-serif text-2xl">{{ label }}</span>
    <span class="mt-1 block text-xs leading-relaxed text-ink/55">Введите пункты через запятую или с новой строки. Каждый фрагмент сохранится отдельным элементом массива.</span>
    <textarea
      :value="draft"
      rows="8"
      required
      :placeholder="placeholder"
      class="mt-4 w-full rounded-xl border border-border-strong px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary"
      @focus="editing = true"
      @input="update"
      @blur="normalize"
    />
    <span class="mt-2 block text-xs text-primary">Сейчас пунктов: {{ modelValue.filter(item => item.trim()).length }}</span>
  </label>
</template>
