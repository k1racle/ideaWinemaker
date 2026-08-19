<script setup lang="ts">
import type { WineryFormValue } from '~/utils/admin-content-validation'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const form = ref<WineryFormValue>({
  slug: '',
  title: '',
  legalName: '',
  excerpt: '',
  content: '',
  image: '',
  foundedYear: '',
  region: '',
  address: '',
  latitude: '',
  longitude: '',
  website: '',
  email: '',
  phone: '',
  vineyardArea: '',
  annualProduction: '',
  specialization: '',
  visitInfo: '',
})
const pending = ref(false)
const errorMessage = ref('')
const validationErrors = ref<string[]>([])

const makeSlug = () => { form.value.slug = slugify(form.value.title) }

watch(form, () => {
  if (validationErrors.value.length) validationErrors.value = validateWineryForm(form.value)
}, { deep: true })

const submit = async () => {
  validationErrors.value = validateWineryForm(form.value)
  if (validationErrors.value.length) {
    errorMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  pending.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/wineries', { method: 'POST', body: toWineryPayload(form.value) })
    await clearNuxtData('admin-content')
    await navigateTo('/admin')
  } catch (error) {
    validationErrors.value = getApiValidationErrors(error)
    errorMessage.value = validationErrors.value.length ? '' : getApiErrorMessage(error, 'Не удалось сохранить винодельню')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    pending.value = false
  }
}

useHead({ title: 'Добавить винодельню — Админ-панель' })
</script>

<template>
  <main class="container-iw py-10">
    <NuxtLink to="/admin" class="text-xs uppercase tracking-[0.14em] text-primary">← Вернуться к списку</NuxtLink>
    <div class="mt-6 max-w-5xl">
      <h1 class="font-serif text-[clamp(36px,5vw,52px)]">Новая винодельня</h1>
      <p class="mt-2 max-w-3xl text-sm leading-relaxed text-ink/60">Винодельня сохраняется как самостоятельная запись без связи с виноделами, винами и терруарами. На публичном сайте эти данные пока не используются.</p>
    </div>

    <AdminValidationSummary :errors="validationErrors" />
    <p v-if="errorMessage" role="alert" class="mt-6 max-w-5xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

    <form class="mt-8 max-w-5xl space-y-8" novalidate @submit.prevent="submit">
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

      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Добавить винодельню' }}</button>
        <NuxtLink to="/admin" class="flex min-h-12 items-center rounded-full border border-border-strong px-7 text-sm">Отмена</NuxtLink>
      </div>
    </form>
  </main>
</template>
