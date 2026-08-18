<script setup lang="ts">
import type { AdminContentOverview } from '~~/shared/types/content'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: overview } = await useFetch<AdminContentOverview>('/api/admin/content', {
  default: () => ({ wineries: [], stores: [], winemakers: [], terroirs: [], wines: [] }),
})

const form = reactive({
  winemakerId: 0,
  terroirId: 0,
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  image: '',
  authorQuote: '',
  details: [
    { title: 'Урожай', items: [''] },
    { title: 'Сезон', items: [''] },
    { title: 'Технология', items: [''] },
  ],
  meta: {
    wineType: '',
    variety: '',
    method: '',
    methodCode: '',
    year: '',
    alcohol: '',
    volume: '',
    batch: '',
    bottleNumber: '',
    servingTemperature: '',
    color: '',
    aroma: '',
    taste: '',
    pairing: '',
  },
  isVisible: true,
})
const pending = ref(false)
const errorMessage = ref('')
const validationErrors = ref<string[]>([])
const previewOpen = ref(false)

const selectedWinemaker = computed(() => overview.value.winemakers.find(item => item.id === form.winemakerId))
const selectedTerroir = computed(() => overview.value.terroirs.find(item => item.id === form.terroirId))

const makeSlug = () => { form.slug = slugify(`${form.meta.variety}-${form.meta.method}`) }

watch(form, () => {
  if (validationErrors.value.length) validationErrors.value = validateWineForm(form)
}, { deep: true })

const submit = async () => {
  validationErrors.value = validateWineForm(form)
  if (validationErrors.value.length) {
    errorMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  pending.value = true
  errorMessage.value = ''
  try {
    const created = await $fetch<{ id: number, slug: string }>('/api/admin/wines', {
      method: 'POST',
      body: form,
    })
    await clearNuxtData(['public-wines', 'public-winemakers', 'public-terroirs'])
    const isEffectivelyVisible = form.isVisible && selectedWinemaker.value?.isVisible && selectedTerroir.value?.isVisible
    await navigateTo(isEffectivelyVisible ? `/wine/${created.slug}` : '/admin')
  } catch (error) {
    validationErrors.value = getApiValidationErrors(error)
    errorMessage.value = validationErrors.value.length ? '' : getApiErrorMessage(error, 'Не удалось сохранить вино')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    pending.value = false
  }
}

useHead({ title: 'Добавить вино — Админ-панель' })
</script>

<template>
  <main class="container-iw py-10">
    <NuxtLink to="/admin" class="text-xs uppercase tracking-[0.14em] text-primary">← Вернуться к списку</NuxtLink>
    <div class="mt-6 flex max-w-5xl flex-wrap items-end justify-between gap-5">
      <div>
        <h1 class="font-serif text-[clamp(36px,5vw,52px)]">Новое вино</h1>
        <p class="mt-2 text-sm text-ink/60">Вино обязательно связывается с одним виноделом.</p>
      </div>
      <button type="button" class="min-h-11 cursor-pointer rounded-full border border-primary px-5 text-xs uppercase tracking-[0.14em] text-primary" @click="previewOpen = true">
        Открыть предпросмотр
      </button>
    </div>

    <p v-if="!overview.winemakers.length" class="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Сначала добавьте хотя бы одного винодела.</p>
    <p v-if="!overview.terroirs.length" class="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Сначала добавьте хотя бы один терруар.</p>
    <AdminValidationSummary :errors="validationErrors" />
    <p v-if="errorMessage" role="alert" class="mt-6 max-w-5xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

    <form class="mt-8 max-w-5xl space-y-8" novalidate @submit.prevent="submit">
      <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-2">
        <label class="block md:col-span-2">
          <span class="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-primary">Винодел</span>
          <select v-model.number="form.winemakerId" required class="min-h-12 w-full rounded-xl border border-border-strong bg-canvas px-4 text-sm outline-none focus:border-primary">
            <option :value="0" disabled>Выберите винодела</option>
            <option v-for="winemaker in overview.winemakers" :key="winemaker.id" :value="winemaker.id">{{ winemaker.title }}{{ winemaker.isVisible ? '' : ' — скрыт' }}</option>
          </select>
        </label>
        <label class="block md:col-span-2">
          <span class="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-primary">Терруар</span>
          <select v-model.number="form.terroirId" required class="min-h-12 w-full rounded-xl border border-border-strong bg-canvas px-4 text-sm outline-none focus:border-primary">
            <option :value="0" disabled>Выберите терруар</option>
            <option v-for="terroir in overview.terroirs" :key="terroir.id" :value="terroir.id">{{ terroir.title }} · {{ terroir.code }}{{ terroir.isVisible ? '' : ' — скрыт' }}</option>
          </select>
          <span class="mt-2 block text-xs text-ink/55">Название, код, описание и координаты берутся из отдельной записи терруара.</span>
        </label>
        <AdminField v-model="form.title" label="Заголовок" />
        <div>
          <AdminField v-model="form.slug" label="Slug" placeholder="sovinyon-blan-metod" />
          <button type="button" class="mt-2 cursor-pointer text-xs text-primary underline" @click="makeSlug">Сформировать из сорта и метода</button>
        </div>
        <AdminField v-model="form.meta.wineType" label="Тип вина" placeholder="Вино белое сухое" />
        <AdminField v-model="form.meta.variety" label="Сорт" />
        <AdminField v-model="form.meta.method" label="Метод" />
        <AdminField v-model="form.meta.methodCode" label="Код метода" />
        <AdminField v-model="form.meta.year" label="Год урожая" />
        <AdminUnitField v-model="form.meta.alcohol" label="Крепость" suffix="%" placeholder="12,5" />
        <AdminUnitField v-model="form.meta.volume" label="Объём" suffix="л." joiner=" " placeholder="0,75" />
        <AdminField v-model="form.image" label="Путь к основному изображению" placeholder="/uploads/2026/04/wine.png" />
        <AdminField v-model="form.excerpt" class="md:col-span-2" label="Краткое описание" multiline :rows="3" />
        <AdminField v-model="form.content" class="md:col-span-2" label="Авторский замысел" multiline :rows="7" />
        <AdminField v-model="form.authorQuote" class="md:col-span-2" label="Цитата автора" multiline :rows="7" />
      </section>

      <section class="grid gap-6 rounded-2xl border border-border bg-canvas p-6 md:grid-cols-3">
        <AdminUnitField v-model="form.meta.batch" label="Тираж" suffix="бут." joiner=" " mode="integer" placeholder="600" />
        <AdminField v-model="form.meta.bottleNumber" label="Номер / тираж" placeholder="001 / 600" />
        <AdminUnitField v-model="form.meta.servingTemperature" label="Температура подачи" suffix="°С" mode="range" placeholder="7–9" />
        <AdminField v-model="form.meta.color" class="md:col-span-3" label="Цвет" multiline :rows="3" />
        <AdminField v-model="form.meta.aroma" class="md:col-span-3" label="Аромат" multiline :rows="3" />
        <AdminField v-model="form.meta.taste" class="md:col-span-3" label="Вкус" multiline :rows="3" />
        <AdminField v-model="form.meta.pairing" class="md:col-span-3" label="Гастропара" multiline :rows="4" />
      </section>

      <AdminDetailsEditor v-model="form.details" />

      <label class="flex items-center gap-3 rounded-2xl border border-border bg-canvas p-5">
        <input v-model="form.isVisible" type="checkbox" class="size-5 accent-primary">
        <span><strong class="block">Показывать на сайте</strong><span class="text-sm text-ink/55">Вино также не показывается, пока скрыт его винодел.</span></span>
      </label>

      <div class="flex flex-wrap gap-4">
        <button type="submit" :disabled="pending || !overview.winemakers.length || !overview.terroirs.length" class="min-h-12 cursor-pointer rounded-full bg-primary px-7 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-50">{{ pending ? 'Сохранение…' : 'Добавить вино' }}</button>
        <button type="button" class="min-h-12 cursor-pointer rounded-full border border-primary px-7 text-sm uppercase tracking-[0.14em] text-primary" @click="previewOpen = true">Предпросмотр</button>
        <NuxtLink to="/admin" class="flex min-h-12 items-center rounded-full border border-border-strong px-7 text-sm">Отмена</NuxtLink>
      </div>
    </form>

    <AdminPreviewModal v-model="previewOpen" title="Предпросмотр вина">
      <template #default="{ showHints }">
        <AdminWinePreview :value="form" :winemaker="selectedWinemaker" :terroir="selectedTerroir" :show-hints="showHints" />
      </template>
    </AdminPreviewModal>
  </main>
</template>
