<script setup lang="ts">
interface WinePreviewValue {
  winemakerId: number
  terroirId: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  authorQuote: string
  details: Array<{ title: string, items: string[] }>
  meta: {
    wineType: string
    variety: string
    method: string
    methodCode: string
    year: string
    alcohol: string
    volume: string
    batch: string
    bottleNumber: string
    servingTemperature: string
    color: string
    aroma: string
    taste: string
    pairing: string
  }
  isVisible: boolean
}

interface WinemakerPreviewOption {
  title: string
  initials: string
  slug: string
  isVisible: boolean
}

interface TerroirPreviewOption {
  title: string
  code: string
  slug: string
  content?: string
  isVisible: boolean
}

const props = withDefaults(defineProps<{
  value: WinePreviewValue
  winemaker?: WinemakerPreviewOption
  terroir?: TerroirPreviewOption
  showHints?: boolean
}>(), {
  winemaker: undefined,
  terroir: undefined,
  showHints: true,
})

const imageFailed = ref(false)
watch(() => props.value.image, () => { imageFailed.value = false })

const text = (value: string, fallback: string) => value.trim() || fallback
const terroirParagraphs = computed(() => (props.terroir?.content || '').split(/\n\s*\n/).filter(item => item.trim()))
const detailGroups = computed(() => props.value.details
  .map(group => ({ ...group, items: group.items.filter(item => item.trim()) }))
  .filter(group => group.title.trim() || group.items.length))
const effectivelyVisible = computed(() => props.value.isVisible && props.winemaker?.isVisible !== false && props.terroir?.isVisible !== false)
const specs = computed<Array<[string, string, string]>>(() => [
  ['Год', props.value.meta.year, 'Год урожая'],
  ['Крепость', props.value.meta.alcohol, 'Крепость'],
  ['Объём', props.value.meta.volume, 'Объём'],
  ['Терруар', props.terroir?.title || '', 'Выбранный терруар'],
  ['Тираж', props.value.meta.batch, 'Тираж'],
  ['Температура подачи', props.value.meta.servingTemperature, 'Температура подачи'],
  ['Цвет', props.value.meta.color, 'Цвет'],
  ['Аромат', props.value.meta.aroma, 'Аромат'],
  ['Вкус', props.value.meta.taste, 'Вкус'],
  ['Гастропара', props.value.meta.pairing, 'Гастропара'],
])
</script>

<template>
  <div class="bg-surface px-4 py-8 sm:px-8 lg:px-12">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">Страница вина</p>
          <p class="mt-1 text-sm text-ink/55">Предпросмотр повторяет основные блоки публичной страницы.</p>
        </div>
        <span :class="effectivelyVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'" class="rounded-full px-3 py-1.5 text-xs">
          {{ effectivelyVisible ? 'Будет опубликовано' : 'Будет скрыто' }}
        </span>
      </div>

      <section class="grid grid-cols-[minmax(280px,380px)_minmax(0,1fr)] items-center gap-8 max-[850px]:grid-cols-1">
        <AdminPreviewField label="Путь к основному изображению" :show-hints="showHints">
          <div class="flex h-[520px] items-center justify-center bg-canvas p-5">
            <img
              v-if="value.image && !imageFailed"
              :src="value.image"
              :alt="text(value.title, 'Вино')"
              class="h-full w-full object-contain"
              @error="imageFailed = true"
            >
            <p v-else class="text-center text-sm text-ink/40">Здесь появится изображение бутылки</p>
          </div>
        </AdminPreviewField>

        <div class="min-w-0 space-y-5">
          <AdminPreviewField label="Тип вина" :show-hints="showHints">
            <p class="px-3 py-4 text-xs uppercase tracking-[0.22em] text-primary">{{ text(value.meta.wineType, 'Тип вина') }}</p>
          </AdminPreviewField>
          <AdminPreviewField label="Заголовок" :show-hints="showHints">
            <h1 class="px-3 py-4 font-serif text-[clamp(36px,5vw,52px)] leading-[0.98]">{{ text(value.title, 'Название вина') }}</h1>
          </AdminPreviewField>
          <AdminPreviewField label="Сорт" :show-hints="showHints">
            <h2 class="px-3 py-4 font-serif text-[clamp(28px,4vw,40px)]">{{ text(value.meta.variety, 'Сорт винограда') }}</h2>
          </AdminPreviewField>
          <AdminPreviewField label="Метод" :show-hints="showHints">
            <h3 class="px-3 py-4 font-serif text-[clamp(24px,3vw,34px)]">{{ text(value.meta.method, 'Метод производства') }}</h3>
          </AdminPreviewField>
          <div class="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            <AdminPreviewField v-for="spec in specs" :key="spec[0]" :label="spec[2]" :show-hints="showHints">
              <div class="min-h-20 border-b border-border-warm px-3 py-4">
                <span class="text-[10px] uppercase tracking-[0.12em] text-primary">{{ spec[0] }}</span>
                <p class="mt-1 text-sm leading-relaxed">{{ text(spec[1], 'Не заполнено') }}</p>
              </div>
            </AdminPreviewField>
          </div>
        </div>
      </section>

      <section class="mt-12 grid grid-cols-2 gap-8 max-[800px]:grid-cols-1">
        <AdminPreviewField label="Авторский замысел" :show-hints="showHints">
          <div class="px-5 py-6">
            <h2 class="font-serif text-3xl">Авторский замысел</h2>
            <p class="mt-4 leading-relaxed">{{ text(value.content, 'Здесь появится основной текст о замысле вина') }}</p>
          </div>
        </AdminPreviewField>
        <div class="space-y-6">
          <AdminPreviewField label="Цитата автора" :show-hints="showHints">
            <blockquote class="border-l-2 border-primary px-6 py-5 font-serif text-2xl leading-[1.35] text-muted">
              {{ text(value.authorQuote, 'Здесь появится цитата автора') }}
            </blockquote>
          </AdminPreviewField>
          <AdminPreviewField label="Винодел" description="Выбранный винодел образует обязательную связь с вином." :show-hints="showHints">
            <div class="bg-canvas px-5 py-6">
              <p class="text-[10px] uppercase tracking-[0.16em] text-primary">О виноделе</p>
              <p class="mt-2 font-serif text-2xl">{{ winemaker?.title || 'Винодел не выбран' }}</p>
              <p v-if="winemaker" class="mt-2 text-sm text-ink/55">Код: {{ winemaker.initials }} · /vinodely/{{ winemaker.slug }}</p>
            </div>
          </AdminPreviewField>
        </div>
      </section>

      <AdminPreviewField class="mt-12" label="Описание терруара" :show-hints="showHints">
        <section class="px-5 py-6">
          <h2 class="font-serif text-3xl">Терруар</h2>
          <div v-if="terroirParagraphs.length" class="mt-4 space-y-4 leading-relaxed text-ink/80">
            <p v-for="(paragraph, index) in terroirParagraphs" :key="index">{{ paragraph }}</p>
          </div>
          <p v-else class="mt-4 text-sm text-ink/40">Абзацы о терруаре появятся здесь</p>
        </section>
      </AdminPreviewField>

      <section class="mt-12 grid grid-cols-3 gap-6 max-[850px]:grid-cols-1">
        <AdminPreviewField
          v-for="(group, groupIndex) in detailGroups"
          :key="groupIndex"
          label="Группа характеристик"
          :show-hints="showHints"
        >
          <article class="h-full bg-canvas px-5 py-6">
            <h2 class="font-serif text-3xl">{{ text(group.title, 'Название группы') }}</h2>
            <ul v-if="group.items.length" class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li v-for="(item, itemIndex) in group.items" :key="itemIndex">{{ item }}</li>
            </ul>
            <p v-else class="mt-4 text-sm text-ink/40">Строки группы появятся здесь</p>
          </article>
        </AdminPreviewField>
        <p v-if="!detailGroups.length" class="col-span-full rounded-xl border border-dashed border-border p-6 text-sm text-ink/40">Группы характеристик пока не заполнены</p>
      </section>

      <section class="mt-12">
        <h2 class="font-serif text-3xl">Карточка в каталоге</h2>
        <div class="mt-6 max-w-sm bg-canvas p-5 text-center">
          <div class="flex h-64 items-center justify-center bg-surface p-4">
            <img v-if="value.image && !imageFailed" :src="value.image" :alt="text(value.title, 'Вино')" class="h-full w-full object-contain">
            <p v-else class="text-sm text-ink/40">Изображение бутылки</p>
          </div>
          <p class="mt-4 text-xs uppercase tracking-[0.18em] text-primary">{{ text(value.meta.wineType, 'Тип вина') }}</p>
          <p class="mt-2 font-serif text-2xl">{{ text(value.title, 'Название вина') }}</p>
          <p class="mt-2 text-sm text-ink/70">{{ text(value.meta.variety, 'Сорт') }}</p>
          <p class="mt-1 text-sm text-ink/60">{{ text(value.meta.method, 'Метод') }}</p>
          <p class="text-sm text-ink/60">{{ text(value.meta.year, 'Год') }} · {{ text(terroir?.title || '', 'Терруар') }}</p>
        </div>
      </section>

      <section class="mt-12 rounded-2xl border border-border bg-canvas p-6">
        <h2 class="font-serif text-3xl">Служебные и дополнительные поля</h2>
        <div class="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AdminPreviewField label="Slug" description="Адрес публичной страницы вина." :show-hints="showHints">
            <p class="break-all px-4 py-5 font-mono text-sm">/wine/{{ text(value.slug, 'slug-vina') }}</p>
          </AdminPreviewField>
          <AdminPreviewField label="Код метода" description="Используется фильтром каталога." :show-hints="showHints">
            <p class="px-4 py-5 font-serif text-3xl text-primary">{{ text(value.meta.methodCode, 'КОД') }}</p>
          </AdminPreviewField>
          <AdminPreviewField label="Выбранный терруар" description="Вино связано с отдельной записью терруара в SQLite." :show-hints="showHints">
            <p class="px-4 py-5 font-mono text-sm">{{ text(terroir?.slug || '', 'slug') }} · {{ text(terroir?.code || '', 'код') }}</p>
          </AdminPreviewField>
          <AdminPreviewField label="Номер / тираж" description="Сохраняется в базе, но сейчас не выводится отдельным блоком." :show-hints="showHints">
            <p class="px-4 py-5 text-lg">{{ text(value.meta.bottleNumber, 'Не заполнено') }}</p>
          </AdminPreviewField>
          <AdminPreviewField class="md:col-span-2" label="Краткое описание" description="Используется как описание страницы; в текущей карточке каталога не показывается." :show-hints="showHints">
            <p class="px-4 py-5 leading-relaxed">{{ text(value.excerpt, 'Краткое описание пока не заполнено') }}</p>
          </AdminPreviewField>
        </div>

      </section>
    </div>
  </div>
</template>
