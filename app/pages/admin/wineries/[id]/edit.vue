<script setup lang="ts">
import type { WineryFormValue } from '~/utils/admin-content-validation'
import type { AdminWineryEditorData } from '~~/shared/types/content'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const recordId = Number(route.params.id)
if (!Number.isInteger(recordId) || recordId <= 0) throw createError({ statusCode: 400, statusMessage: 'Некорректный ID винодельни' })

const { data: initial, error: loadError } = await useFetch<AdminWineryEditorData>(`/api/admin/wineries/${recordId}`)
if (loadError.value) throw createError({ statusCode: loadError.value.statusCode || 500, statusMessage: loadError.value.statusMessage || 'Не удалось загрузить винодельню' })
if (!initial.value) throw createError({ statusCode: 404, statusMessage: 'Винодельня не найдена' })

const form = ref<WineryFormValue>({
  slug: initial.value.slug,
  title: initial.value.title,
  legalName: initial.value.legalName,
  excerpt: initial.value.excerpt,
  content: initial.value.content,
  image: initial.value.image,
  foundedYear: initial.value.foundedYear === null ? '' : String(initial.value.foundedYear),
  region: initial.value.region,
  address: initial.value.address,
  latitude: initial.value.latitude === null ? '' : String(initial.value.latitude),
  longitude: initial.value.longitude === null ? '' : String(initial.value.longitude),
  website: initial.value.website,
  email: initial.value.email,
  phone: initial.value.phone,
  vineyardArea: initial.value.vineyardArea,
  annualProduction: initial.value.annualProduction,
  specialization: initial.value.specialization,
  visitInfo: initial.value.visitInfo,
  isVisible: initial.value.isVisible,
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
    await $fetch(`/api/admin/wineries/${recordId}`, { method: 'PATCH', body: toWineryPayload(form.value) })
    await clearNuxtData('admin-content')
    await navigateTo('/admin')
  } catch (error) {
    validationErrors.value = getApiValidationErrors(error)
    errorMessage.value = validationErrors.value.length ? '' : getApiErrorMessage(error, 'Не удалось сохранить изменения')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    pending.value = false
  }
}

useHead({ title: `Редактировать ${form.value.title} — Админ-панель` })
</script>

<template>
  <main class="container-iw py-10">
    <NuxtLink to="/admin" class="text-xs uppercase tracking-[0.14em] text-primary">← Вернуться к списку</NuxtLink>
    <div class="mt-6 max-w-5xl">
      <h1 class="font-serif text-[clamp(36px,5vw,52px)]">Редактировать винодельню</h1>
      <p class="mt-2 text-sm text-ink/60">Изменения и статус записи сохранятся в SQLite.</p>
    </div>

    <AdminValidationSummary :errors="validationErrors" />
    <p v-if="errorMessage" role="alert" class="mt-6 max-w-5xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

    <form class="mt-8 max-w-5xl space-y-8" novalidate @submit.prevent="submit">
      <AdminWineryFormFields v-model="form" />
      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Сохранить изменения' }}</button>
        <NuxtLink to="/admin" class="flex min-h-12 items-center rounded-full border border-border-strong px-7 text-sm">Отмена</NuxtLink>
      </div>
    </form>
  </main>
</template>
