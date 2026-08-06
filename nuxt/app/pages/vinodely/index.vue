<script setup lang="ts">
import { winemakers } from '~~/shared/mock/winemakers'

useHead({
  title: 'Виноделы — Идея Винодела',
  meta: [{ name: 'description', content: 'Авторы коллекции: Андрюс Юцис, семья Доротенко и Анна Нестерова.' }],
})
</script>

<template>
  <main class="pt-[52px] max-[600px]:pt-9">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[0.95] tracking-[0.18em]">Виноделы</h1>
        <div class="mx-auto mt-5 h-px w-20 bg-secondary/65" />
        <!-- <p class="mx-auto mt-4 max-w-[840px] text-ink/70">В коллекции винодел выступает как автор, а технология становится языком его высказывания.</p> -->
      </section>
      <section class="mt-[52px]">
        <div class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          <WinemakerCard v-for="winemaker in winemakers" :key="winemaker.id" :winemaker="winemaker" />
        </div>
      </section>
    </div>
  </main>
</template>
