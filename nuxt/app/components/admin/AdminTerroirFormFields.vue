<script setup lang="ts">
import type { TerroirFormValue } from '~/utils/admin-content-validation'

const form = defineModel<TerroirFormValue>({ required: true })
const makeSlug = () => { form.value.slug = slugify(form.value.title) }
</script>

<template>
  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminField v-model="form.title" label="Название" placeholder="Новороссийск" />
    <div>
      <AdminField v-model="form.slug" label="Slug" placeholder="novorossiysk" />
      <p class="mt-2 text-xs leading-relaxed text-ink/55">Только строчные латинские буквы, цифры и дефисы.</p>
      <button type="button" class="mt-2 cursor-pointer text-xs text-primary underline" @click="makeSlug">Сформировать из названия</button>
    </div>
    <AdminField v-model="form.meta.code" label="Код терруара" placeholder="NVR" />
    <AdminField v-model="form.image" label="Путь к изображению" placeholder="/uploads/2026/04/terroir.jpg" />
    <AdminField v-model="form.excerpt" class="md:col-span-2" label="Краткое описание" multiline :rows="3" />
    <AdminField v-model="form.content" class="md:col-span-2" label="Основное описание" multiline :rows="7" />
  </section>

  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminField v-model="form.meta.climate" label="Климат" multiline :rows="3" />
    <AdminField v-model="form.meta.soil" label="Почва" multiline :rows="3" />
    <AdminUnitField v-model="form.meta.area" label="Площадь" suffix="га" joiner=" " placeholder="5,8" />
    <AdminField v-model="form.meta.humidity" label="Влажность" placeholder="умеренная" />
    <AdminField v-model="form.meta.slope" label="Склон" placeholder="южный" />
    <AdminUnitField v-model="form.meta.altitude" label="Высота" suffix="м" joiner=" " mode="range" placeholder="180–260" />
  </section>

  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminField v-model="form.meta.coordinates" class="md:col-span-2" label="Координаты для подписи" placeholder="44.7974, 37.6532" />
    <AdminField v-model="form.meta.center[0]" label="Широта центра карты" placeholder="44.7974" />
    <AdminField v-model="form.meta.center[1]" label="Долгота центра карты" placeholder="37.6532" />
    <p class="md:col-span-2 text-xs leading-relaxed text-ink/55">Границы задаются отдельными точками в формате «широта, долгота». Для полигона нужно минимум три точки.</p>
  </section>

  <AdminListEditor v-model="form.meta.bounds" label="Границы участка" add-label="Добавить точку" :multiline="false" />
  <AdminListEditor v-model="form.meta.tags" label="Теги" add-label="Добавить тег" :multiline="false" />
  <label class="flex items-center gap-3 rounded-2xl border border-border bg-canvas p-5">
    <input v-model="form.isVisible" type="checkbox" class="size-5 accent-primary">
    <span><strong class="block">Показывать на сайте</strong><span class="text-sm text-ink/55">Если скрыть терруар, связанные вина также временно исчезнут с публичного сайта.</span></span>
  </label>
</template>
