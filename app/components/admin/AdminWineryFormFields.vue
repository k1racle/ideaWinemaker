<script setup lang="ts">
import type { WineryFormValue } from '~/utils/admin-content-validation'

const form = defineModel<WineryFormValue>({ required: true })
const makeSlug = () => { form.value.slug = slugify(form.value.title) }
</script>

<template>
  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminField v-model="form.title" label="Название" placeholder="Винодельня…" />
    <div>
      <AdminField v-model="form.slug" label="Slug" placeholder="nazvanie-vinodelni" />
      <p class="mt-2 text-xs leading-relaxed text-ink/55">Только строчные латинские буквы, цифры и дефисы.</p>
      <button type="button" class="mt-2 cursor-pointer text-xs text-primary underline" @click="makeSlug">Сформировать из названия</button>
    </div>
    <AdminField v-model="form.legalName" label="Юридическое название" placeholder="ООО «…»" :required="false" />
    <AdminField v-model="form.foundedYear" label="Год основания" placeholder="2015" :required="false" />
    <AdminField v-model="form.region" label="Регион" placeholder="Краснодарский край" />
    <AdminField v-model="form.address" label="Адрес" placeholder="Город, улица, дом" :required="false" />
    <AdminField v-model="form.image" class="md:col-span-2" label="Путь к основному изображению" placeholder="/uploads/2026/04/winery.jpg" :required="false" />
    <AdminField v-model="form.excerpt" class="md:col-span-2" label="Краткое описание" multiline :rows="3" :required="false" />
    <AdminField v-model="form.content" class="md:col-span-2" label="Полное описание" multiline :rows="7" :required="false" />
  </section>

  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminUnitField v-model="form.vineyardArea" label="Площадь виноградников" suffix="га" joiner=" " placeholder="25" :required="false" />
    <AdminUnitField v-model="form.annualProduction" label="Годовой объём производства" suffix="бут./год" joiner=" " mode="integer" placeholder="100000" :required="false" />
    <AdminField v-model="form.specialization" class="md:col-span-2" label="Специализация" placeholder="Сорта, стили вин, методы производства" multiline :rows="4" :required="false" />
    <AdminField v-model="form.visitInfo" class="md:col-span-2" label="Посещение и экскурсии" placeholder="Условия посещения, дегустации, режим работы" multiline :rows="4" :required="false" />
  </section>

  <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
    <AdminField v-model="form.website" label="Сайт" placeholder="https://example.ru" :required="false" />
    <AdminField v-model="form.email" label="Email" placeholder="info@example.ru" :required="false" />
    <AdminField v-model="form.phone" label="Телефон" placeholder="+7 900 000-00-00" :required="false" />
    <div class="hidden md:block" />
    <AdminField v-model="form.latitude" label="Широта" placeholder="44.7974" :required="false" />
    <AdminField v-model="form.longitude" label="Долгота" placeholder="37.6532" :required="false" />
    <p class="md:col-span-2 text-xs leading-relaxed text-ink/55">Координаты необязательны, но если они известны, заполните оба поля.</p>
  </section>

  <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-canvas p-5">
    <input v-model="form.isVisible" type="checkbox" class="size-5 cursor-pointer accent-primary">
    <span><strong class="block">Показывать запись</strong><span class="text-sm text-ink/55">Винодельни пока не выводятся на публичном сайте, но статус сохраняется в SQLite.</span></span>
  </label>
</template>
