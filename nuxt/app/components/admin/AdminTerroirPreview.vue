<script setup lang="ts">
import type { TerroirFormValue } from '~/utils/admin-content-validation'

const props = withDefaults(defineProps<{
  value: TerroirFormValue
  showHints?: boolean
}>(), { showHints: true })

const imageFailed = ref(false)
watch(() => props.value.image, () => { imageFailed.value = false })
const text = (value: string, fallback: string) => value.trim() || fallback
const tags = computed(() => props.value.meta.tags.filter(item => item.trim()))
const bounds = computed(() => props.value.meta.bounds.filter(item => item.trim()))
</script>

<template>
  <div class="bg-surface px-4 py-8 sm:px-8 lg:px-12">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div><p class="text-xs uppercase tracking-[0.18em] text-primary">Терруар</p><p class="mt-1 text-sm text-ink/55">Предпросмотр отдельной записи терруара.</p></div>
        <span :class="value.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'" class="rounded-full px-3 py-1.5 text-xs">{{ value.isVisible ? 'Будет опубликован' : 'Будет скрыт' }}</span>
      </div>

      <section class="grid grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] gap-8 max-[850px]:grid-cols-1">
        <AdminPreviewField label="Изображение терруара" :show-hints="showHints">
          <div class="flex min-h-[420px] items-center justify-center bg-canvas">
            <img v-if="value.image && !imageFailed" :src="value.image" :alt="text(value.title, 'Терруар')" class="h-full max-h-[520px] w-full object-cover" @error="imageFailed = true">
            <p v-else class="text-sm text-ink/40">Здесь появится изображение терруара</p>
          </div>
        </AdminPreviewField>
        <div class="space-y-5">
          <AdminPreviewField label="Название и код" :show-hints="showHints"><div class="px-5 py-6"><p class="text-xs uppercase tracking-[0.18em] text-primary">{{ text(value.meta.code, 'КОД') }}</p><h1 class="mt-2 font-serif text-[clamp(38px,5vw,58px)]">{{ text(value.title, 'Название терруара') }}</h1></div></AdminPreviewField>
          <AdminPreviewField label="Краткое описание" :show-hints="showHints"><p class="px-5 py-6 text-lg leading-relaxed">{{ text(value.excerpt, 'Краткое описание') }}</p></AdminPreviewField>
          <AdminPreviewField label="Основное описание" :show-hints="showHints"><p class="whitespace-pre-line px-5 py-6 leading-relaxed">{{ text(value.content, 'Основное описание терруара') }}</p></AdminPreviewField>
          <div v-if="tags.length" class="flex flex-wrap gap-2"><span v-for="tag in tags" :key="tag" class="rounded-full border border-border-strong px-3 py-1.5 text-xs">{{ tag }}</span></div>
        </div>
      </section>

      <section class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminPreviewField v-for="item in [['Климат', value.meta.climate], ['Почва', value.meta.soil], ['Площадь', value.meta.area], ['Влажность', value.meta.humidity], ['Склон', value.meta.slope], ['Высота', value.meta.altitude]]" :key="item[0]" :label="item[0]" :show-hints="showHints"><div class="min-h-24 px-4 py-5"><p class="text-sm leading-relaxed">{{ text(item[1] || '', 'Не заполнено') }}</p></div></AdminPreviewField>
      </section>

      <section class="mt-10 grid gap-6 md:grid-cols-2">
        <AdminPreviewField label="Центр карты" :show-hints="showHints"><p class="px-5 py-6 font-mono">{{ text(value.meta.center.join(', '), 'Координаты') }}</p></AdminPreviewField>
        <AdminPreviewField label="Границы участка" :show-hints="showHints"><div class="px-5 py-6"><p v-if="!bounds.length" class="text-sm text-ink/40">Точки не заполнены</p><ol v-else class="list-decimal space-y-1 pl-5 font-mono text-sm"><li v-for="point in bounds" :key="point">{{ point }}</li></ol></div></AdminPreviewField>
      </section>

      <section class="mt-10 rounded-2xl border border-border bg-canvas p-6">
        <p class="text-xs uppercase tracking-[0.12em] text-primary">Адрес и служебные данные</p>
        <p class="mt-3 font-mono text-sm">slug: {{ text(value.slug, 'slug-terruara') }}</p>
        <p class="mt-2 font-mono text-sm">координаты: {{ text(value.meta.coordinates, 'не заполнены') }}</p>
      </section>
    </div>
  </div>
</template>
