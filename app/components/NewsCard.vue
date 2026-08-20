<script setup lang="ts">
import type { NewsPost } from '~~/shared/types/site-content'

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
      <NuxtImg
        :src="post.image"
        :alt="post.title"
        :width="900"
        sizes="100vw sm:50vw lg:25vw"
        format="webp"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover"
      />
    </NuxtLink>
    <h3 class="mt-2 font-serif text-[22px] leading-[1.12]">
      <NuxtLink :to="`/novosti/${post.slug}`">{{ post.title }}</NuxtLink>
    </h3>
    <p v-if="showExcerpt" class="mt-1 text-sm leading-relaxed text-ink/65">{{ post.excerpt }}</p>
    <time :datetime="post.publishedAt" class="mt-3 block text-xs tracking-[0.08em] text-muted">
      {{ post.publishedAt.split('-').reverse().join('.') }}
    </time>
    <NuxtLink :to="`/novosti/${post.slug}`" class="mt-3 text-xs uppercase tracking-[0.18em] text-primary">Подробнее
    </NuxtLink>

  </article>
</template>
