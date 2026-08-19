<script setup lang="ts">
import type { StoreFormValue } from '~/utils/admin-content-validation'

const form = defineModel<StoreFormValue>({ required: true })
</script>

<template>
  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminField v-model="form.title" label="Название" placeholder="«ВИНОТЕКА. Название»" />
    <AdminField v-model="form.city" label="Город" placeholder="Краснодар" />
    <AdminField v-model="form.address" class="md:col-span-2" label="Адрес" placeholder="ул. Казбекская, д. 1" />
    <AdminField v-model="form.website" class="md:col-span-2" label="Сайт" placeholder="https://example.ru/" />
  </section>

  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminField v-model="form.latitude" label="Широта" placeholder="45.066195" />
    <AdminField v-model="form.longitude" label="Долгота" placeholder="38.950088" />
    <p class="md:col-span-2 text-xs leading-relaxed text-ink/55">Введите координаты точки в десятичном формате. Допустимы точка или запятая в качестве десятичного разделителя.</p>
  </section>

  <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-canvas p-5">
    <input v-model="form.isVisible" type="checkbox" class="size-5 cursor-pointer accent-primary">
    <span><strong class="block">Показывать на сайте</strong><span class="text-sm text-ink/55">Если выключить, точка исчезнет из блока «Где купить» и с карты, но останется в админке.</span></span>
  </label>
</template>
