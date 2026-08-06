<script setup lang="ts">
import { wines } from '~~/shared/mock/wines'
import type { WineFilters } from '~~/shared/types'

definePageMeta({ alias: ['/wine'] })

const route = useRoute()
const router = useRouter()
const asString = (value: unknown) => typeof value === 'string' ? value : ''

const filters = ref<WineFilters>({
  year: asString(route.query.year),
  terroir: asString(route.query.terroir),
  winemaker: asString(route.query.winemaker),
  method: asString(route.query.method),
})

const filteredWines = computed(() => wines.filter(wine => (
  (!filters.value.year || wine.meta.year === filters.value.year)
  && (!filters.value.terroir || wine.meta.terroirSlug === filters.value.terroir)
  && (!filters.value.winemaker || wine.meta.winemakerSlug === filters.value.winemaker)
  && (!filters.value.method || wine.meta.methodCode === filters.value.method)
)))

const applyFilters = () => {
  const query = Object.fromEntries(Object.entries(filters.value).filter(([, value]) => value))
  router.replace({ query })
}

useHead({
  title: 'Вина — Идея Винодела',
  meta: [{ name: 'description', content: 'Каталог коллекции авторских вин с фильтрацией по урожаю, терруару, виноделу и методу.' }],
})
</script>

<template>
  <main class="pt-[52px] max-[600px]:pt-9">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[0.95] tracking-[0.18em]">Вина</h1>
        <div class="mx-auto mt-5 h-px w-20 bg-secondary/65" />
      </section>

      <section class="mt-[52px]"><WineCodeFilter v-model="filters" show-note @submit="applyFilters" /></section>

      <section class="mt-[52px]">
        <p class="mb-7 text-sm text-ink/60">Найдено вин: {{ filteredWines.length }}</p>
        <div v-if="filteredWines.length" class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          <WineCard v-for="wine in filteredWines" :key="wine.id" :wine="wine" />
        </div>
        <div v-else class="border-y border-border py-16 text-center">
          <p class="font-serif text-2xl">По выбранному коду вина не найдены.</p>
          <button type="button" class="mt-3 text-xs uppercase tracking-[0.18em] text-primary" @click="filters = { year: '', terroir: '', winemaker: '', method: '' }; applyFilters()">Сбросить фильтры</button>
        </div>
      </section>

      <BuySection />
    </div>
  </main>
</template>
