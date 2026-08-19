<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const form = reactive({
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  image: '',
  quote: '',
  biography: [''],
  meta: {
    initials: '',
    location: '',
    aboutBrand: '',
  },
  isVisible: true,
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
    const created = await $fetch<{ id: number, slug: string }>('/api/admin/winemakers', {
      method: 'POST',
      body: form,
    })
    await clearNuxtData(['public-wines', 'public-winemakers'])
    await navigateTo(form.isVisible ? `/vinodely/${created.slug}` : '/admin')
  } catch (error) {
    validationErrors.value = getApiValidationErrors(error)
    errorMessage.value = validationErrors.value.length ? '' : getApiErrorMessage(error, 'Не удалось сохранить винодела')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    pending.value = false
  }
}

useHead({ title: 'Добавить винодела — Админ-панель' })
</script>

<template>
  <main class="container-iw py-10">
    <NuxtLink to="/admin" class="text-xs uppercase tracking-[0.14em] text-primary">← Вернуться к списку</NuxtLink>
    <div class="mt-6 flex max-w-5xl flex-wrap items-end justify-between gap-5">
      <div>
        <h1 class="font-serif text-[clamp(36px,5vw,52px)]">Новый винодел</h1>
        <p class="mt-2 text-sm text-ink/60">Все поля соответствуют текущей структуре `Winemaker`.</p>
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
        <span><strong class="block">Показывать на сайте</strong><span class="text-sm text-ink/55">Если выключить, запись сохранится только в админке.</span></span>
      </label>

      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Добавить винодела' }}</button>
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
