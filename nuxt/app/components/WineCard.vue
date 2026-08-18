<script setup lang="ts">
import type { Wine } from '~~/shared/types/content'

defineProps<{ wine: Wine }>()
</script>

<template>
  <article class="relative flex min-w-0 flex-col items-center pb-5 text-center">
    <NuxtLink :to="`/wine/${wine.slug}`" class="absolute inset-0 z-[2]" :aria-label="`${wine.meta.variety}: ${wine.meta.method}`" />
    <div class="relative z-[1] flex h-[338px] w-full items-center justify-center overflow-hidden max-[900px]:h-[310px] max-[600px]:h-[290px]">
      <img
        :src="wine.image"
        :alt="`${wine.meta.variety}. ${wine.meta.method}`"
        loading="lazy"
        class="h-full w-full object-contain"
      >
    </div>
    <div class="relative z-[1] mt-3 text-xs uppercase tracking-[0.18em] text-primary">{{ wine.meta.wineType }}</div>
    <h3 class="relative z-[1] mt-1 flex min-h-[2.3em] items-center justify-center font-serif text-[22px] leading-[1.08]">{{ wine.title }}</h3>
    <div class="relative z-[1] text-sm text-ink/70">{{ wine.meta.variety }}</div>
    <div class="relative z-[1] mt-1 text-sm text-ink/60">{{ wine.meta.method }}</div>
    <div class="relative z-[1] text-sm text-ink/60">{{ wine.meta.year }} · {{ wine.meta.terroirName }}</div>
  </article>
</template>
