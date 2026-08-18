<script setup lang="ts">
import type { Winemaker } from '~~/shared/types/content'

defineProps<{ winemaker: Winemaker }>()
</script>

<template>
  <article class="flex min-w-0 flex-col pb-5">
    <NuxtLink :to="`/vinodely/${winemaker.slug}`" class="block h-[min(39vw,520px)] min-h-[460px] overflow-hidden max-[900px]:h-[520px] max-[600px]:h-[440px] max-[600px]:min-h-0">
      <img :src="winemaker.image" :alt="winemaker.title" loading="lazy" class="h-full w-full object-cover object-[50%_10%]">
    </NuxtLink>
    <h3 class="mt-2 font-serif text-[22px] leading-[1.08]"><NuxtLink :to="`/vinodely/${winemaker.slug}`">{{ winemaker.title }}</NuxtLink></h3>
    <p class="mt-2 text-[11px] uppercase tracking-[0.16em] text-primary">{{ winemaker.meta.location }}</p>
    <p class="mt-2 text-sm leading-relaxed text-ink/65">{{ winemaker.excerpt }}</p>
    <NuxtLink :to="`/vinodely/${winemaker.slug}`" class="mt-3 text-xs uppercase tracking-[0.18em] text-primary">Подробнее</NuxtLink>
  </article>
</template>
