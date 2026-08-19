<script setup lang="ts">
import type { Winemaker } from '~~/shared/types/content'

const route = useRoute()
const slug = String(route.params.slug)
const { data: winemakerData, error } = await useFetch<Winemaker>(`/api/winemakers/${encodeURIComponent(slug)}`, {
  key: `winemaker-${slug}`,
})
const winemaker = winemakerData.value
if (!winemaker) throw createError({ statusCode: error.value?.statusCode || 404, message: 'Винодел не найден' })

const { data: wines } = await usePublicWines()
const relatedWines = computed(() => wines.value.filter(wine => winemaker.meta.wineSlugs.includes(wine.slug)))

useHead({
  title: `${winemaker.title} — Идея Винодела`,
  meta: [{ name: 'description', content: winemaker.excerpt }],
})
</script>

<template>
  <main class="pt-8">
    <div class="container-iw">
      <section><NuxtLink to="/vinodely" class="text-xs uppercase tracking-[0.16em] text-primary">← Назад к виноделам</NuxtLink></section>
      <section class="mt-8 grid grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start gap-[clamp(28px,4vw,48px)] max-[900px]:grid-cols-1">
        <div class="sticky top-[92px] max-[900px]:static max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[520px]">
          <NuxtImg
            :src="winemaker.image"
            :alt="winemaker.title"
            :width="900"
            sizes="100vw md:380px"
            format="webp"
            fetchpriority="high"
            class="max-h-[min(72vh,520px)] w-full object-cover object-[50%_10%]"
          />
        </div>
        <div class="min-w-0">
          <h1 class="font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[1.02] tracking-[0.05em]">{{ winemaker.title }}</h1>
          <p class="mt-3 text-[12px] uppercase tracking-[0.2em] text-primary">{{ winemaker.meta.location }}</p>
          <blockquote class="mt-8 max-w-[700px] border-l-2 border-primary px-6 py-2 font-serif text-[clamp(19px,2vw,26px)] leading-[1.4] text-muted">{{ winemaker.quote }}</blockquote>
          <h2 class="mt-5 font-sans text-[12px] font-normal uppercase leading-none tracking-[0.02em] text-primary">{{ winemaker.meta.aboutBrand }}</h2>
          <div class="mt-8">
            <h2 class="font-serif text-[32px] uppercase tracking-[0.12em]">Биография</h2>
            <div class="mt-5 space-y-4 leading-relaxed text-ink/85"><p v-for="paragraph in winemaker.biography" :key="paragraph">{{ paragraph }}</p></div>
          </div>
        </div>
      </section>

      <section class="mt-[52px]">
        <SectionHeading title="Вино винодела" :level="3" centered />
        <div class="flex flex-wrap justify-center gap-7">
          <WineCard
            v-for="wine in relatedWines"
            :key="wine.id"
            :wine="wine"
            class="w-[calc((100%_-_3.5rem)/3)] max-[900px]:w-[calc((100%_-_1.75rem)/2)] max-[620px]:w-full"
          />
        </div>
      </section>
    </div>
  </main>
</template>
