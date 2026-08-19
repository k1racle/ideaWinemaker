<script setup lang="ts">
interface WinemakerPreviewValue {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  quote: string
  biography: string[]
  meta: {
    initials: string
    location: string
    aboutBrand: string
  }
  isVisible: boolean
}

const props = withDefaults(defineProps<{
  value: WinemakerPreviewValue
  showHints?: boolean
}>(), {
  showHints: true,
})

const imageFailed = ref(false)
watch(() => props.value.image, () => { imageFailed.value = false })

const text = (value: string, fallback: string) => value.trim() || fallback
const biography = computed(() => props.value.biography.filter(item => item.trim()))
</script>

<template>
  <div class="bg-surface px-4 py-8 sm:px-8 lg:px-12">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">Страница винодела</p>
          <p class="mt-1 text-sm text-ink/55">Поля обновляются сразу, сохранение не требуется.</p>
        </div>
        <span :class="value.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'" class="rounded-full px-3 py-1.5 text-xs">
          {{ value.isVisible ? 'Будет опубликован' : 'Будет скрыт' }}
        </span>
      </div>

      <section class="grid grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start gap-10 max-[850px]:grid-cols-1">
        <AdminPreviewField label="Путь к изображению" :show-hints="showHints">
          <div class="flex min-h-[480px] items-center justify-center overflow-hidden bg-canvas">
            <img
              v-if="value.image && !imageFailed"
              :src="value.image"
              :alt="text(value.title, 'Винодел')"
              class="h-[520px] w-full object-cover object-[50%_10%]"
              @error="imageFailed = true"
            >
            <div v-else class="px-6 text-center text-sm text-ink/40">Здесь появится фотография винодела</div>
          </div>
        </AdminPreviewField>

        <div class="min-w-0 space-y-7">
          <AdminPreviewField label="Заголовок" :show-hints="showHints">
            <h1 class="px-3 py-4 font-serif text-[clamp(36px,5vw,52px)] uppercase leading-[1.02] tracking-[0.05em]">
              {{ text(value.title, 'Имя винодела') }}
            </h1>
          </AdminPreviewField>
          <AdminPreviewField label="Локация" :show-hints="showHints">
            <p class="px-3 py-4 text-xs uppercase tracking-[0.2em] text-primary">{{ text(value.meta.location, 'Локация') }}</p>
          </AdminPreviewField>
          <AdminPreviewField label="Цитата" :show-hints="showHints">
            <blockquote class="border-l-2 border-primary px-6 py-4 font-serif text-[clamp(19px,2vw,26px)] leading-[1.4] text-muted">
              {{ text(value.quote, 'Здесь появится цитата винодела') }}
            </blockquote>
          </AdminPreviewField>
          <AdminPreviewField label="Подпись к цитате" :show-hints="showHints">
            <h2 class="px-3 py-4 text-xs uppercase text-primary">{{ text(value.meta.aboutBrand, 'Подпись к цитате') }}</h2>
          </AdminPreviewField>
          <AdminPreviewField label="Биография" :show-hints="showHints">
            <div class="px-3 py-5">
              <h2 class="font-serif text-3xl uppercase tracking-[0.12em]">Биография</h2>
              <div v-if="biography.length" class="mt-5 space-y-4 leading-relaxed text-ink/85">
                <p v-for="(paragraph, index) in biography" :key="index">{{ paragraph }}</p>
              </div>
              <p v-else class="mt-4 text-sm text-ink/40">Абзацы биографии появятся здесь</p>
            </div>
          </AdminPreviewField>
        </div>
      </section>

      <section class="mt-12">
        <h2 class="font-serif text-3xl">Карточка в списке виноделов</h2>
        <div class="mt-6 max-w-sm bg-canvas p-5">
          <div class="h-72 overflow-hidden bg-surface">
            <img v-if="value.image && !imageFailed" :src="value.image" :alt="text(value.title, 'Винодел')" class="h-full w-full object-cover object-[50%_10%]">
            <div v-else class="flex h-full items-center justify-center px-5 text-center text-sm text-ink/40">Фотография</div>
          </div>
          <AdminPreviewField class="mt-4" label="Заголовок" :show-hints="showHints">
            <h3 class="px-3 py-3 font-serif text-2xl">{{ text(value.title, 'Имя винодела') }}</h3>
          </AdminPreviewField>
          <AdminPreviewField class="mt-4" label="Локация" :show-hints="showHints">
            <p class="px-3 py-3 text-xs uppercase tracking-[0.16em] text-primary">{{ text(value.meta.location, 'Локация') }}</p>
          </AdminPreviewField>
          <AdminPreviewField class="mt-4" label="Краткое описание" :show-hints="showHints">
            <p class="px-3 py-3 text-sm leading-relaxed text-ink/65">{{ text(value.excerpt, 'Краткое описание карточки') }}</p>
          </AdminPreviewField>
        </div>
      </section>

      <section class="mt-12 rounded-2xl border border-border bg-canvas p-6">
        <h2 class="font-serif text-3xl">Служебные и дополнительные поля</h2>
        <div class="mt-6 grid gap-5 md:grid-cols-2">
          <AdminPreviewField label="Slug" description="Формирует адрес страницы винодела." :show-hints="showHints">
            <p class="break-all px-4 py-5 font-mono text-sm">/vinodely/{{ text(value.slug, 'slug-vinodela') }}</p>
          </AdminPreviewField>
          <AdminPreviewField label="Инициалы / код" description="Показывается в фильтре виноделов и связывается с винами." :show-hints="showHints">
            <p class="px-4 py-5 font-serif text-3xl text-primary">{{ text(value.meta.initials, 'КОД') }}</p>
          </AdminPreviewField>
          <AdminPreviewField class="md:col-span-2" label="Основное описание" description="Поле сохраняется в базе, но на текущей публичной странице отдельным блоком не выводится." :show-hints="showHints">
            <p class="px-4 py-5 leading-relaxed text-ink/75">{{ text(value.content, 'Основное описание пока не заполнено') }}</p>
          </AdminPreviewField>
        </div>
      </section>
    </div>
  </div>
</template>
