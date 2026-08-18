<script setup lang="ts">
import type { TerroirFormValue } from '~/utils/admin-content-validation'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const form = ref<TerroirFormValue>({
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  image: '',
  gallery: [],
  meta: {
    code: '',
    climate: '',
    tags: [''],
    soil: '',
    coordinates: '',
    center: ['', ''],
    bounds: ['', '', ''],
    area: '',
    humidity: '',
    slope: '',
    altitude: '',
  },
  isVisible: true,
})
const pending = ref(false)
const errorMessage = ref('')
const validationErrors = ref<string[]>([])
const previewOpen = ref(false)

watch(form, () => {
  if (validationErrors.value.length) validationErrors.value = validateTerroirForm(form.value)
}, { deep: true })

const submit = async () => {
  validationErrors.value = validateTerroirForm(form.value)
  if (validationErrors.value.length) {
    errorMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  pending.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/terroirs', { method: 'POST', body: toTerroirPayload(form.value) })
    await clearNuxtData(['public-wines', 'public-terroirs'])
    await navigateTo('/admin')
  } catch (error) {
    validationErrors.value = getApiValidationErrors(error)
    errorMessage.value = validationErrors.value.length ? '' : getApiErrorMessage(error, 'Не удалось сохранить терруар')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    pending.value = false
  }
}

useHead({ title: 'Добавить терруар — Админ-панель' })
</script>

<template>
  <main class="container-iw py-10">
    <NuxtLink to="/admin" class="text-xs uppercase tracking-[0.14em] text-primary">← Вернуться к списку</NuxtLink>
    <div class="mt-6 flex max-w-5xl flex-wrap items-end justify-between gap-5">
      <div><h1 class="font-serif text-[clamp(36px,5vw,52px)]">Новый терруар</h1><p class="mt-2 text-sm text-ink/60">После сохранения терруар можно будет выбрать в форме вина.</p></div>
      <button type="button" class="min-h-11 cursor-pointer rounded-full border border-primary px-5 text-xs uppercase tracking-[0.14em] text-primary" @click="previewOpen = true">Открыть предпросмотр</button>
    </div>

    <AdminValidationSummary :errors="validationErrors" />
    <p v-if="errorMessage" role="alert" class="mt-6 max-w-5xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

    <form class="mt-8 max-w-5xl space-y-8" novalidate @submit.prevent="submit">
      <AdminTerroirFormFields v-model="form" />
      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Добавить терруар' }}</button>
        <button type="button" class="min-h-12 cursor-pointer rounded-full border border-primary px-7 text-sm uppercase tracking-[0.14em] text-primary" @click="previewOpen = true">Предпросмотр</button>
        <NuxtLink to="/admin" class="flex min-h-12 items-center rounded-full border border-border-strong px-7 text-sm">Отмена</NuxtLink>
      </div>
    </form>

    <AdminPreviewModal v-model="previewOpen" title="Предпросмотр терруара">
      <template #default="{ showHints }"><AdminTerroirPreview :value="form" :show-hints="showHints" /></template>
    </AdminPreviewModal>
  </main>
</template>
