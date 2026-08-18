<script setup lang="ts">
interface DetailGroup {
  title: string
  items: string[]
}

const props = defineProps<{ modelValue: DetailGroup[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: DetailGroup[]] }>()

const updateGroup = (index: number, group: DetailGroup) => {
  const next = props.modelValue.map((item, itemIndex) => itemIndex === index ? group : item)
  emit('update:modelValue', next)
}

const addGroup = () => emit('update:modelValue', [...props.modelValue, { title: '', items: [''] }])
const removeGroup = (index: number) => emit('update:modelValue', props.modelValue.filter((_, itemIndex) => itemIndex !== index))
const moveGroup = (index: number, direction: -1 | 1) => {
  const target = index + direction
  if (target < 0 || target >= props.modelValue.length) return
  const next = [...props.modelValue]
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  emit('update:modelValue', next)
}

const commaSeparatedGroups = new Set(['урожай', 'сезон', 'технология'])
const isCommaSeparatedGroup = (title: string) => commaSeparatedGroups.has(title.trim().toLocaleLowerCase('ru-RU'))
const groupInputLabel = (title: string) => {
  const normalized = title.trim().toLocaleLowerCase('ru-RU')
  if (normalized === 'урожай') return 'Характеристики урожая'
  if (normalized === 'сезон') return 'Особенности сезона'
  return 'Этапы технологии'
}
const groupPlaceholder = (title: string) => {
  const normalized = title.trim().toLocaleLowerCase('ru-RU')
  if (normalized === 'урожай') return 'Год посадки лозы: 2013, Год урожая: 2025, Способ сбора: ручной'
  if (normalized === 'сезон') return 'Холодная весна, Прохладное лето, Осадки перед сбором'
  return 'Приёмка винограда, Гребнеотделение и дробление, Ферментация, Выдержка'
}
</script>

<template>
  <fieldset class="rounded-2xl border border-border bg-canvas p-5">
    <legend class="px-2 font-serif text-2xl">Группы характеристик</legend>
    <div class="space-y-6">
      <section v-for="(group, groupIndex) in modelValue" :key="groupIndex" class="rounded-xl bg-surface p-4">
        <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <AdminField
            :model-value="group.title"
            label="Название группы"
            @update:model-value="updateGroup(groupIndex, { ...group, title: $event })"
          />
          <div class="flex items-end gap-1 pb-1">
            <button type="button" class="cursor-pointer rounded border border-border px-2 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-30" :disabled="groupIndex === 0" @click="moveGroup(groupIndex, -1)">↑</button>
            <button type="button" class="cursor-pointer rounded border border-border px-2 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-30" :disabled="groupIndex === modelValue.length - 1" @click="moveGroup(groupIndex, 1)">↓</button>
            <button type="button" class="cursor-pointer rounded border border-red-300 px-2 py-2 text-xs text-red-700 disabled:cursor-not-allowed disabled:opacity-30" :disabled="modelValue.length === 1" @click="removeGroup(groupIndex)">Удалить</button>
          </div>
        </div>
        <AdminCommaSeparatedItems
          v-if="isCommaSeparatedGroup(group.title)"
          :model-value="group.items"
          :label="groupInputLabel(group.title)"
          :placeholder="groupPlaceholder(group.title)"
          @update:model-value="updateGroup(groupIndex, { ...group, items: $event })"
        />
        <AdminListEditor
          v-else
          class="mt-4"
          :model-value="group.items"
          label="Строки"
          add-label="Добавить строку"
          @update:model-value="updateGroup(groupIndex, { ...group, items: $event })"
        />
      </section>
      <button type="button" class="cursor-pointer rounded-full border border-primary px-4 py-2 text-xs uppercase tracking-[0.12em] text-primary" @click="addGroup">Добавить группу</button>
    </div>
  </fieldset>
</template>
