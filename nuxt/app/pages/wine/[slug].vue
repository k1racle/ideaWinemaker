<script setup lang="ts">
import type { WineFilters } from '~~/shared/types'
import type { Terroir, Wine, Winemaker } from '~~/shared/types/content'

const route = useRoute()
const router = useRouter()
const slug = String(route.params.slug)
const { data: wineData, error } = await useFetch<Wine>(`/api/wines/${encodeURIComponent(slug)}`, {
  key: `wine-${slug}`,
})
const wine = wineData.value
if (!wine) throw createError({ statusCode: error.value?.statusCode || 404, message: 'Вино не найдено' })

const { data: winemaker } = await useFetch<Winemaker>(`/api/winemakers/${encodeURIComponent(wine.meta.winemakerSlug)}`, {
  key: `winemaker-${wine.meta.winemakerSlug}`,
})
const { data: wines } = await usePublicWines()
const { data: terroir } = await useFetch<Terroir>(`/api/terroirs/${encodeURIComponent(wine.meta.terroirSlug)}`, {
  key: `terroir-${wine.meta.terroirSlug}`,
})
const terroirParagraphs = computed(() => (terroir.value?.content || '').split(/\n\s*\n/).filter(Boolean))
const harvestDetails = wine.details.find(group => group.title === 'Урожай')
const seasonDetails = wine.details.find(group => group.title === 'Сезон')
const technologyDetails = wine.details.find(group => group.title === 'Технология')
const filters = ref<WineFilters>({
  year: wine.meta.year,
  terroir: wine.meta.terroirSlug,
  winemaker: wine.meta.winemakerSlug,
  method: wine.meta.methodCode,
})

const applyFilters = () => {
  const query = Object.fromEntries(Object.entries(filters.value).filter(([, value]) => value))
  router.push({ path: '/wines', query })
}

const specs = [
  ['Год', wine.meta.year], ['Крепость', wine.meta.alcohol], ['Объём', wine.meta.volume],
  ['Терруар', wine.meta.terroirName], ['Тираж', wine.meta.batch], ['Температура подачи', wine.meta.servingTemperature],
  ['Цвет', wine.meta.color], ['Аромат', wine.meta.aroma], ['Вкус', wine.meta.taste], ['Гастропара', wine.meta.pairing],
]

useHead({
  title: `${wine.meta.variety}. ${wine.meta.method} — Идея Винодела`,
  meta: [{ name: 'description', content: wine.excerpt }],
})
</script>

<template>
  <main class="pt-8 font-sans">
    <div class="container-iw">
      <section><NuxtLink to="/wines" class="text-xs uppercase tracking-[0.16em] text-primary">← Назад к архиву вина</NuxtLink></section>

      <section class="mt-7"><WineCodeFilter v-model="filters" :show-note="false" @submit="applyFilters" /></section>

      <section class="mt-[52px] grid grid-cols-[minmax(460px,0.9fr)_minmax(0,1.1fr)] items-stretch gap-7 max-[1000px]:grid-cols-[minmax(410px,0.9fr)_minmax(0,1.1fr)] max-[900px]:grid-cols-1">
        <div class="flex min-h-[720px] items-center justify-center overflow-hidden max-[900px]:min-h-[600px] max-[560px]:min-h-[500px]">
          <img :src="wine.image" :alt="`${wine.meta.variety}. ${wine.meta.method}`" class="h-[720px] w-full object-cover object-[70%_center] max-[900px]:h-[600px] max-[560px]:h-[500px]">
        </div>
        <div class="flex flex-col justify-center">
          <div class="text-[11px] uppercase tracking-[0.22em] text-primary">{{ wine.meta.wineType }}</div>
          <h1 class="mt-2.5 font-serif text-[clamp(34px,5vw,48px)] leading-[0.98] text-ink">{{ wine.title }}</h1>
          <h2 class="mt-2 font-serif text-[clamp(28px,4vw,38px)] leading-[1.02]">{{ wine.meta.variety }}</h2>
          <h3 class="mt-3 font-serif text-[clamp(24px,3vw,35px)] leading-[1.05]">{{ wine.meta.method }}</h3>
          <div class="mt-6 grid grid-cols-2 gap-x-7 gap-y-3 max-[560px]:grid-cols-1">
            <div v-for="spec in specs" :key="spec[0]" class="border-b border-border-warm pb-3">
              <span class="text-[11px] uppercase tracking-[0.12em] text-primary">{{ spec[0] }}</span>
              <p class="mt-1 text-[15px] leading-[1.45] text-copy">{{ spec[1] }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-[52px] grid grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] items-stretch gap-9 max-[850px]:grid-cols-1" aria-label="Авторский замысел и о виноделе">
        <div>
          <h2 class="font-serif text-[clamp(30px,3vw,35px)] leading-[1.02]">Авторский замысел</h2>
          <p class="mt-4 leading-relaxed">{{ wine.content }}</p>
          <blockquote class="mt-6 border-l-2 border-primary px-6 py-2 font-serif text-[clamp(20px,2.2vw,27px)] leading-[1.35] text-muted">{{ wine.authorQuote }}</blockquote>
        </div>
        <div v-if="winemaker" class="h-full max-[850px]:mx-auto max-[850px]:h-auto max-[850px]:w-full max-[850px]:max-w-[500px]">
          <NuxtLink :to="`/vinodely/${winemaker.slug}`" class="block h-full min-h-[620px] overflow-hidden max-[850px]:aspect-[718/1024] max-[850px]:h-auto max-[850px]:min-h-0">
            <img :src="winemaker.image" :alt="winemaker.title" class="h-full w-full object-cover object-[50%_10%]">
          </NuxtLink>
        </div>
      </section>

      <section class="mt-[52px] grid grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)] gap-9 max-[850px]:grid-cols-1" aria-label="Терруар">
        <div>
          <h2 class="font-serif text-[clamp(30px,3vw,35px)] leading-[1.02]">Терруар</h2>
          <div class="mt-4 space-y-4 leading-relaxed text-ink/80"><p v-for="paragraph in terroirParagraphs" :key="paragraph">{{ paragraph }}</p></div>
        </div>
        <ClientOnly v-if="terroir && terroir.meta.bounds.length >= 3">
          <TerroirMap :center="terroir.meta.center" :bounds="terroir.meta.bounds" :title="terroir.title" />
          <template #fallback><div class="h-[360px] w-full rounded-[14px] bg-surface" /></template>
        </ClientOnly>
        <div v-else class="flex h-[360px] items-center justify-center rounded-[14px] bg-surface px-7 text-center text-sm leading-relaxed text-ink/60">Карта появится после заполнения центра и границ терруара в админке.</div>
      </section>

      <section class="mt-[52px] grid grid-cols-2 gap-x-16 gap-y-10 max-[850px]:grid-cols-1" aria-label="Урожай, сезон и технология">
        <div>
          <article v-if="harvestDetails">
            <h2 class="font-serif text-[28px] leading-none">{{ harvestDetails.title }}</h2>
            <ul class="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-[1.6] text-ink">
              <li v-for="item in harvestDetails.items" :key="item">{{ item }}</li>
            </ul>
          </article>
          <article v-if="seasonDetails" class="mt-8">
            <h2 class="font-serif text-[28px] leading-none">{{ seasonDetails.title }}</h2>
            <ul class="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-[1.6] text-ink">
              <li v-for="item in seasonDetails.items" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>

        <article v-if="technologyDetails">
          <h2 class="font-serif text-[28px] leading-none">{{ technologyDetails.title }}</h2>
          <ol class="mt-5">
            <li v-for="(item, index) in technologyDetails.items" :key="item" class="relative grid min-h-16 grid-cols-[40px_minmax(0,1fr)] gap-4 pb-5 last:min-h-0 last:pb-0">
              <span v-if="index < technologyDetails.items.length - 1" aria-hidden="true" class="absolute bottom-0 left-[16px] top-8 w-px bg-primary/55" />
              <span class="relative z-[1] flex size-8 items-center justify-center rounded-full bg-primary text-sm text-canvas">{{ index + 1 }}</span>
              <p class="pt-1 text-[15px] leading-[1.55] text-ink">{{ item }}</p>
            </li>
          </ol>
        </article>
      </section>

      <section class="mt-[52px]">
        <SectionHeading title="Вина коллекции Идея Винодела" centered />
        <div class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1"><WineCard v-for="item in wines" :key="item.id" :wine="item" /></div>
      </section>

      <BuySection />
    </div>
  </main>
</template>
