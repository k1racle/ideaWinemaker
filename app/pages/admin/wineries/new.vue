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
  isVisible: true,
})
const pending = ref(false)
const errorMessage = ref('')
const validationErrors = ref<string[]>([])

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
      <AdminWineryFormFields v-model="form" />

      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Добавить винодельню' }}</button>
        <NuxtLink to="/admin" class="flex min-h-12 items-center rounded-full border border-border-strong px-7 text-sm">Отмена</NuxtLink>
      </div>
    </form>
  </main>
</template>
