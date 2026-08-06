<script setup lang="ts">
import { winemakers } from '~~/shared/mock/winemakers'
import { founder, founderBiography, manifestParagraphs } from '~~/shared/mock/pages'

definePageMeta({ alias: ['/manifest'] })

useHead({
  title: 'Манифест — Идея Винодела',
  meta: [{ name: 'description', content: 'Манифест бренда и история основателя проекта Алексея Батагова.' }],
})
</script>

<template>
  <main class="pt-[52px]">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[0.95] tracking-[0.18em]">Манифест</h1>
        <div class="mx-auto mt-5 h-px w-20 bg-secondary/65" />
      </section>

      <section class="mt-[52px] grid grid-cols-[minmax(300px,420px)_1fr] items-start gap-[35px] max-[850px]:grid-cols-1">
        <div class="sticky top-[110px] h-[min(62vw,560px)] min-h-[460px] overflow-hidden max-[850px]:static max-[850px]:mx-auto max-[850px]:h-[540px] max-[850px]:w-full max-[850px]:max-w-[520px] max-[600px]:h-[440px] max-[600px]:min-h-0">
          <img :src="founder.image" :alt="founder.name" class="h-full w-full object-cover">
        </div>
        <div class="min-w-0">
          <div class="space-y-4 text-[17px] leading-[1.8]"><p v-for="paragraph in manifestParagraphs" :key="paragraph">{{ paragraph }}</p></div>
          <section class="mt-[52px]">
            <h2 class="font-serif text-[clamp(34px,4vw,52px)] uppercase leading-[1.02] tracking-[0.05em]">{{ founder.name }}</h2>
            <p class="mt-1 text-xs uppercase tracking-[0.2em] text-primary">{{ founder.role }}</p>
            <blockquote class="mt-5 font-serif text-[clamp(20px,2.2vw,28px)] leading-[1.3] text-muted">{{ founder.quote }}</blockquote>
            <div class="mt-6 space-y-4 leading-relaxed"><p v-for="paragraph in founderBiography" :key="paragraph">{{ paragraph }}</p></div>
          </section>
        </div>
      </section>

      <section class="mt-[52px]">
        <SectionHeading title="Виноделы" centered />
        <div class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1"><WinemakerCard v-for="winemaker in winemakers" :key="winemaker.id" :winemaker="winemaker" /></div>
      </section>
    </div>
  </main>
</template>
