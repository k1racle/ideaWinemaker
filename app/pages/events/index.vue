<script setup lang="ts">
import { events } from '~~/shared/mock/events'

useHead({
  title: 'Мероприятия — Идея Винодела',
  meta: [{ name: 'description', content: 'Выставки, презентации и эногастрономические события проекта.' }],
})
</script>

<template>
  <main class="pt-[52px] max-[600px]:pt-9">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[0.95] tracking-[0.18em]">Мероприятия</h1>
        <div class="mx-auto mt-5 h-px w-20 bg-secondary/65" />
        <p class="mx-auto mt-4 max-w-[840px] text-ink/70">Презентации коллекции, отраслевые выставки и культурные события бренда.</p>
      </section>
      <section class="mt-[52px]">
        <div v-if="events.length" class="grid grid-cols-2 gap-7 max-[700px]:grid-cols-1"><EventCard v-for="event in events" :key="event.id" :event="event" /></div>
        <p v-else class="py-16 text-center text-ink/60">Мероприятия пока не добавлены.</p>
      </section>
    </div>
  </main>
</template>
