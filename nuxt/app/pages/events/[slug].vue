<script setup lang="ts">
import { eventBySlug } from '~~/shared/mock/events'

const route = useRoute()
const event = eventBySlug(String(route.params.slug))
if (!event) throw createError({ statusCode: 404, statusMessage: 'Мероприятие не найдено' })

useHead({
  title: `${event.title} — Идея Винодела`,
  meta: [{ name: 'description', content: event.excerpt }],
})
</script>

<template>
  <main class="pt-8">
    <div class="container-iw">
      <section>
        <NuxtLink to="/events" class="text-xs uppercase tracking-[0.16em] text-bordeaux">← Все мероприятия</NuxtLink>
        <h1 class="mt-6 font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[1.05] tracking-[0.06em]">{{ event.title }}</h1>
      </section>
      <section class="mt-[52px] h-[500px] overflow-hidden max-[700px]:h-[330px]"><img :src="event.image" :alt="event.title" class="h-full w-full object-cover"></section>
      <section class="mt-[52px] grid grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)] gap-8 max-[800px]:grid-cols-1">
        <aside class="order-1 space-y-5 max-[800px]:order-2">
          <h2 class="font-serif text-[28px] uppercase tracking-[0.12em]">Детали события</h2>
          <div class="border-t border-line pt-4 text-sm leading-relaxed">
            <div class="text-[11px] uppercase tracking-[0.14em] text-bordeaux">Дата и время</div>
            <p class="mt-1">{{ event.meta.dateStart }} – {{ event.meta.dateEnd }}<br>Время {{ event.meta.timeStart }}–{{ event.meta.timeEnd }}</p>
          </div>
          <div class="border-t border-line pt-4 text-sm leading-relaxed">
            <div class="text-[11px] uppercase tracking-[0.14em] text-bordeaux">Место</div>
            <p class="mt-1">{{ event.meta.city }}<br>{{ event.meta.location }}, {{ event.meta.address }}</p>
          </div>
          <div class="border-t border-line pt-4 text-sm"><span v-if="event.meta.price">Цена: {{ event.meta.price.toLocaleString('ru-RU') }} {{ event.meta.currency }}</span><span v-else>Бесплатно</span> · {{ event.meta.ageLimit }}</div>
          <div class="border-t border-line pt-4 text-sm leading-relaxed">
            <div class="text-[11px] uppercase tracking-[0.14em] text-bordeaux">Организатор</div>
            <p class="mt-1">{{ event.meta.organizer }}</p>
            <a :href="event.meta.organizerUrl" target="_blank" rel="noopener noreferrer" class="text-bordeaux">{{ event.meta.organizerUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') }}</a>
          </div>
        </aside>
        <div class="order-2 space-y-4 text-[17px] leading-[1.8] max-[800px]:order-1"><p v-for="paragraph in event.content" :key="paragraph">{{ paragraph }}</p></div>
      </section>
      <section v-if="event.gallery.length" class="mt-[52px]">
        <SectionHeading title="Галерея" />
        <div class="grid grid-cols-4 gap-7 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1"><div v-for="image in event.gallery" :key="image" class="h-44 overflow-hidden"><img :src="image" alt="" loading="lazy" class="h-full w-full object-cover"></div></div>
      </section>
    </div>
  </main>
</template>
