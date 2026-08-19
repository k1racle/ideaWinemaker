<script setup lang="ts">
import type { AdminWinemakerEditorData } from '~~/shared/types/content'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const recordId = Number(route.params.id)
if (!Number.isInteger(recordId) || recordId <= 0) {
  throw createError({ statusCode: 400, statusMessage: 'Некорректный ID винодела' })
}

const { data: initial, error: loadError } = await useFetch<AdminWinemakerEditorData>(`/api/admin/winemakers/${recordId}`)
if (loadError.value) {
  throw createError({
    statusCode: loadError.value.statusCode || 500,
    statusMessage: loadError.value.statusMessage || 'Не удалось загрузить винодела',
  })
}
if (!initial.value) throw createError({ statusCode: 404, statusMessage: 'Винодел не найден' })

const form = reactive({
  slug: initial.value.slug,
  title: initial.value.title,
  excerpt: initial.value.excerpt,
  content: initial.value.content,
  image: initial.value.image,
  quote: initial.value.quote,
  biography: [...initial.value.biography],
  meta: { ...initial.value.meta },
  isVisible: initial.value.isVisible,
})
const pending = ref(false)
const errorMessage = ref('')
const validationErrors = ref<string[]>([])
const previewOpen = ref(false)

const makeSlug = () => { form.slug = slugify(form.title) }

watch(form, () => {
  if (validationErrors.value.length) validationErrors.value = validateWinemakerForm(form)
}, { deep: true })

const submit = async () => {
  validationErrors.value = validateWinemakerForm(form)
  if (validationErrors.value.length) {
    errorMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  pending.value = true
  errorMessage.value = ''
  try {
    const updated = await $fetch<{ id: number, slug: string }>(`/api/admin/winemakers/${recordId}`, {
      method: 'PATCH',
      body: form,
    })
    await clearNuxtData(['public-wines', 'public-winemakers'])
    await navigateTo(form.isVisible ? `/vinodely/${updated.slug}` : '/admin')
  } catch (error) {
    validationErrors.value = getApiValidationErrors(error)
    errorMessage.value = validationErrors.value.length ? '' : getApiErrorMessage(error, 'Не удалось сохранить изменения')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    pending.value = false
  }
}

useHead({ title: `Редактировать ${form.title} — Админ-панель` })
</script>

<template>
  <main class="container-iw py-10">
    <NuxtLink to="/admin" class="text-xs uppercase tracking-[0.14em] text-primary">← Вернуться к списку</NuxtLink>
    <div class="mt-6 flex max-w-5xl flex-wrap items-end justify-between gap-5">
      <div>
        <h1 class="font-serif text-[clamp(36px,5vw,52px)]">Редактировать винодела</h1>
        <p class="mt-2 text-sm text-ink/60">Изменения сохранятся в SQLite и сразу появятся на сайте, если запись видима.</p>
      </div>
      <button type="button" class="min-h-11 cursor-pointer rounded-full border border-primary px-5 text-xs uppercase tracking-[0.14em] text-primary" @click="previewOpen = true">
        Открыть предпросмотр
      </button>
    </div>

    <AdminValidationSummary :errors="validationErrors" />
    <p v-if="errorMessage" role="alert" class="mt-6 max-w-5xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

    <form class="mt-8 max-w-5xl space-y-8" novalidate @submit.prevent="submit">
      <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
        <AdminField v-model="form.title" label="Заголовок" placeholder="Винодел…" />
        <div>
          <AdminField v-model="form.slug" label="Slug" placeholder="anna-nesterova" />
          <button type="button" class="mt-2 cursor-pointer text-xs text-primary underline" @click="makeSlug">Сформировать из заголовка</button>
        </div>
        <AdminField v-model="form.meta.initials" label="Инициалы / код" placeholder="AN" />
        <AdminField v-model="form.meta.location" label="Локация" />
        <AdminField v-model="form.image" label="Путь к изображению" placeholder="/uploads/2026/04/photo.jpg" />
        <AdminField v-model="form.meta.aboutBrand" label="Подпись к цитате" />
        <AdminField v-model="form.excerpt" class="md:col-span-2" label="Краткое описание" multiline :rows="4" />
        <AdminField v-model="form.content" class="md:col-span-2" label="Основное описание" multiline :rows="5" />
        <AdminField v-model="form.quote" class="md:col-span-2" label="Цитата" multiline :rows="7" />
      </section>

      <AdminListEditor v-model="form.biography" label="Биография" add-label="Добавить абзац" />

      <label class="flex items-center gap-3 rounded-2xl border border-border bg-canvas p-5">
        <input v-model="form.isVisible" type="checkbox" class="size-5 accent-primary">
        <span><strong class="block">Показывать на сайте</strong><span class="text-sm text-ink/55">Если выключить, винодел и связанные с ним вина останутся только в админке.</span></span>
      </label>

      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Сохранить изменения' }}</button>
        <button type="button" class="min-h-12 cursor-pointer rounded-full border border-primary px-7 text-sm uppercase tracking-[0.14em] text-primary" @click="previewOpen = true">Предпросмотр</button>
        <NuxtLink to="/admin" class="flex min-h-12 items-center rounded-full border border-border-strong px-7 text-sm">Отмена</NuxtLink>
      </div>
    </form>

    <AdminPreviewModal v-model="previewOpen" title="Предпросмотр винодела">
      <template #default="{ showHints }">
        <AdminWinemakerPreview :value="form" :show-hints="showHints" />
      </template>
    </AdminPreviewModal>
  </main>
</template>
