<script setup lang="ts">
import type { EventRecord } from '~~/shared/types/site-content'

defineProps<{ event: EventRecord }>()
</script>

<template>
  <article class="flex min-w-0 flex-col pb-5">
    <NuxtLink :to="`/events/${event.slug}`" class="block h-[414px] overflow-hidden max-[900px]:h-[360px] max-[600px]:h-[270px]">
      <NuxtImg
        :src="event.image"
        :alt="event.title"
        :width="900"
        sizes="100vw sm:50vw lg:33vw"
        format="webp"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover"
      />
    </NuxtLink>
    <h3 class="mt-2 font-serif text-[22px] leading-[1.12]"><NuxtLink :to="`/events/${event.slug}`">{{ event.title }}</NuxtLink></h3>
    <div class="mt-1 text-sm text-ink/60">{{ event.meta.dateStart }}<span v-if="event.meta.city"> · {{ event.meta.city }}</span></div>
    <NuxtLink :to="`/events/${event.slug}`" class="mt-3 text-xs uppercase tracking-[0.18em] text-primary">Подробнее</NuxtLink>
  </article>
</template>
