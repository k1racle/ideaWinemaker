<script setup lang="ts">
import type { StoreFormValue } from '~/utils/admin-content-validation'
import type { AdminStoreEditorData } from '~~/shared/types/content'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const recordId = Number(route.params.id)
if (!Number.isInteger(recordId) || recordId <= 0) throw createError({ statusCode: 400, statusMessage: 'Некорректный ID точки магазина' })

const { data: initial, error: loadError } = await useFetch<AdminStoreEditorData>(`/api/admin/stores/${recordId}`)
if (loadError.value) throw createError({ statusCode: loadError.value.statusCode || 500, statusMessage: loadError.value.statusMessage || 'Не удалось загрузить точку магазина' })
if (!initial.value) throw createError({ statusCode: 404, statusMessage: 'Точка магазина не найдена' })

const form = ref<StoreFormValue>({
  title: initial.value.title,
  city: initial.value.city,
  address: initial.value.address,
  website: initial.value.website,
  latitude: String(initial.value.coordinates[0]),
  longitude: String(initial.value.coordinates[1]),
  isVisible: initial.value.isVisible,
})
const pending = ref(false)
const errorMessage = ref('')
const validationErrors = ref<string[]>([])

watch(form, () => {
  if (validationErrors.value.length) validationErrors.value = validateStoreForm(form.value)
}, { deep: true })

const submit = async () => {
  validationErrors.value = validateStoreForm(form.value)
  if (validationErrors.value.length) {
    errorMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  pending.value = true
  errorMessage.value = ''
  try {
    await $fetch(`/api/admin/stores/${recordId}`, { method: 'PATCH', body: toStorePayload(form.value) })
    await clearNuxtData(['admin-content', 'public-stores'])
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
      <h1 class="font-serif text-[clamp(36px,5vw,52px)]">Редактировать точку магазина</h1>
      <p class="mt-2 text-sm text-ink/60">Изменения сразу применятся в блоке «Где купить» и на карте, если точка видима.</p>
    </div>

    <AdminValidationSummary :errors="validationErrors" />
    <p v-if="errorMessage" role="alert" class="mt-6 max-w-5xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

    <form class="mt-8 max-w-5xl space-y-8" novalidate @submit.prevent="submit">
      <AdminStoreFormFields v-model="form" />
      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Сохранить изменения' }}</button>
        <NuxtLink to="/admin" class="flex min-h-12 items-center rounded-full border border-border-strong px-7 text-sm">Отмена</NuxtLink>
      </div>
    </form>
  </main>
</template>
