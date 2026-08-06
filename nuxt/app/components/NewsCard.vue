<script setup lang="ts">
import type { NewsPost } from '~~/shared/mock/news'

withDefaults(defineProps<{
  post: NewsPost
  showExcerpt?: boolean
  centered?: boolean
}>(), {
  showExcerpt: true,
  centered: false,
})
</script>

<template>
  <article class="flex min-w-0 flex-col pb-5" :class="{ 'text-center': centered }">
    <NuxtLink :to="`/novosti/${post.slug}`" class="block h-[338px] overflow-hidden max-[600px]:h-[260px]">
      <img :src="post.image" :alt="post.title" loading="lazy" class="h-full w-full object-cover">
    </NuxtLink>
    <h3 class="mt-2 font-serif text-[22px] leading-[1.12]"><NuxtLink :to="`/novosti/${post.slug}`">{{ post.title }}</NuxtLink></h3>
    <p v-if="showExcerpt" class="mt-1 text-sm leading-relaxed text-black/65">{{ post.excerpt }}</p>
    <NuxtLink :to="`/novosti/${post.slug}`" class="mt-3 text-xs uppercase tracking-[0.18em] text-bordeaux">Подробнее</NuxtLink>
  </article>
</template>
