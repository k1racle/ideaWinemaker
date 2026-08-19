<script setup lang="ts">
import { newsPosts } from '~~/shared/mock/news'
import { founder, homeIntro } from '~~/shared/mock/pages'
import { emptyWineFilters } from '~~/shared/types'

const router = useRouter()
const filters = ref(emptyWineFilters())
const { data: wines } = await usePublicWines()
const { data: winemakers } = await usePublicWinemakers()

const applyFilters = () => {
  const query = Object.fromEntries(Object.entries(filters.value).filter(([, value]) => value))
  router.push({ path: '/wines', query })
}

useHead({
  title: 'Идея Винодела — коллекция авторских вин',
  meta: [{ name: 'description', content: 'Авторские вина, виноделы, терруары и технологические решения одной коллекции.' }],
})
</script>

<template>
  <main class="pt-[52px] max-[600px]:pt-9">
    <div class="container-iw">
      <section class="flex flex-col items-center text-center">
        <h1 class="max-w-[756px] font-serif text-[clamp(38px,5vw,46px)] font-normal uppercase leading-[1.25] tracking-[0.08em]">{{ homeIntro.title }}</h1>
        <div class="line-secondary" />
      </section>

      <section class="mt-[52px]">
        <WineCodeFilter v-model="filters" show-note @submit="applyFilters" />
      </section>

      <section class="mt-[52px] grid grid-cols-[minmax(300px,420px)_1fr] items-start gap-[34px] max-[850px]:grid-cols-1">
        <div class="h-[min(60vw,560px)] min-h-[460px] overflow-hidden max-[850px]:mx-auto max-[850px]:h-[540px] max-[850px]:w-full max-[850px]:max-w-[520px] max-[600px]:h-[440px] max-[600px]:min-h-0">
          <NuxtImg
            :src="founder.image"
            :alt="founder.name"
            :width="840"
            sizes="100vw md:420px"
            format="webp"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 class="font-serif text-[clamp(34px,4vw,52px)] uppercase leading-[1.02] tracking-[0.05em]">{{ founder.name }}</h2>
          <p class="mt-1 text-xs uppercase tracking-[0.2em] text-primary">{{ founder.role }}</p>
          <blockquote class="mt-[18px] font-serif text-[clamp(20px,2.2vw,28px)] leading-[1.24] text-muted">{{ founder.quote }}</blockquote>
          <p class="mt-5 leading-relaxed">{{ homeIntro.founderText }}</p>
          <NuxtLink to="/about" class="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-primary">Манифест</NuxtLink>
        </div>
      </section>

      <section class="mt-[52px]">
        <SectionHeading title="Виноделы" centered />
        <div class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          <WinemakerCard v-for="winemaker in winemakers" :key="winemaker.id" :winemaker="winemaker" />
        </div>
      </section>

      <section class="mt-[52px]">
        <SectionHeading title="Коллекция авторских вин" centered />
        <div class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          <WineCard v-for="wine in wines" :key="wine.id" :wine="wine" />
        </div>
      </section>
    </div>

    <section class="container-iw mt-[52px]">
      <NuxtLink to="/spektakl" class="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-ink px-10 py-14 text-center text-canvas max-[700px]:min-h-[280px] max-[700px]:px-[26px] max-[520px]:min-h-60 max-[520px]:px-5 max-[520px]:py-7">
        <NuxtImg
          src="/uploads/2026/04/banner-na-glavnvuyu-spektakl.jpg"
          alt="Иммерсивная эногастрономическая постановка"
          :width="1920"
          :height="1080"
          sizes="100vw lg:1320px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover object-[center_38%] opacity-65"
        />
        <h2 class="relative z-[1] max-w-[850px] font-serif text-[clamp(32px,5vw,58px)] font-normal leading-[1.05] tracking-[0.04em]">Иммерсивная эногастрономическая постановка «Идея Винодела»</h2>
      </NuxtLink>
    </section>

    <div class="container-iw">
      <section class="mt-[52px] pt-[30px]">
        <SectionHeading title="Новости" centered />
        <div class="grid grid-cols-2 gap-7 max-[700px]:grid-cols-1">
          <NewsCard v-for="post in newsPosts" :key="post.id" :post="post" :show-excerpt="false" centered />
        </div>
      </section>

      <BuySection />
      <SocialSection />
    </div>
  </main>
</template>
