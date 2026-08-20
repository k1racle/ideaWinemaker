<script setup lang="ts">
import type { WineFilters } from '~~/shared/types'

const route = useRoute()
const router = useRouter()
const { data: wines } = await usePublicWines()
const queryText = ref(typeof route.query.q === 'string' ? route.query.q : '')
const filters = ref<WineFilters>({
  year: typeof route.query.year === 'string' ? route.query.year : '',
  terroir: typeof route.query.terroir === 'string' ? route.query.terroir : '',
  winemaker: typeof route.query.winemaker === 'string' ? route.query.winemaker : '',
  method: typeof route.query.method === 'string' ? route.query.method : '',
})

const results = computed(() => {
  const needle = queryText.value.trim().toLocaleLowerCase('ru')
  return wines.value.filter(wine => {
    const haystack = `${wine.title} ${wine.meta.variety} ${wine.meta.method} ${wine.meta.terroirName} ${wine.excerpt}`.toLocaleLowerCase('ru')
    return (!needle || haystack.includes(needle))
      && (!filters.value.year || wine.meta.year === filters.value.year)
      && (!filters.value.terroir || wine.meta.terroirSlug === filters.value.terroir)
      && (!filters.value.winemaker || wine.meta.winemakerSlug === filters.value.winemaker)
      && (!filters.value.method || wine.meta.methodCode === filters.value.method)
  })
})

const search = () => {
  const query = Object.fromEntries(Object.entries({ q: queryText.value, ...filters.value }).filter(([, value]) => value))
  router.replace({ query })
}

useHead({ title: 'Поиск авторского вина', meta: [{ name: 'description', content: 'Поиск по коллекции авторских вин Кубани по сорту, урожаю, терруару, виноделу и методу производства.' }] })
</script>

<template>
  <main class="pt-[52px]">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[0.95] tracking-[0.18em]">Поиск вина</h1>
        <form class="mx-auto mt-8 flex max-w-[720px] overflow-hidden rounded-full border border-border-strong" @submit.prevent="search">
          <input v-model="queryText" type="search" placeholder="Название, сорт или технология" class="min-h-12 min-w-0 flex-1 bg-canvas px-6 text-sm outline-none placeholder:text-ink/40">
          <button type="submit" class="flex min-w-14 items-center justify-center bg-primary text-canvas" aria-label="Найти">
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-5 fill-none stroke-current" stroke-width="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 5 5" />
            </svg>
          </button>
        </form>
      </section>
      <section class="mt-[52px]"><WineCodeFilter v-model="filters" @submit="search" /></section>
      <section class="mt-[52px]">
        <p class="mb-7 text-sm text-ink/60">Найдено вин: {{ results.length }}</p>
        <div v-if="results.length" class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1"><WineCard v-for="wine in results" :key="wine.id" :wine="wine" /></div>
        <p v-else class="border-y border-border py-16 text-center font-serif text-2xl">Ничего не найдено</p>
      </section>
    </div>
  </main>
</template>
