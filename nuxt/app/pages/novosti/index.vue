<script setup lang="ts">
import { newsPosts } from '~~/shared/mock/news'

useHead({ title: 'Новости — Идея Винодела', meta: [{ name: 'description', content: 'Новости проекта, коллекции и российского виноделия.' }] })
</script>

<template>
  <main class="pt-[52px]">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(38px,5vw,48px)] uppercase leading-[0.95] tracking-[0.18em]">Новости</h1>
        <div class="mx-auto mt-5 h-px w-20 bg-secondary/65" />
      </section>
      <section class="mt-[52px]">
        <div v-if="newsPosts.length" class="grid grid-cols-3 gap-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1"><NewsCard v-for="post in newsPosts" :key="post.id" :post="post" :show-excerpt="false" /></div>
        <p v-else class="py-16 text-center text-ink/60">Записей пока нет.</p>
      </section>
    </div>
  </main>
</template>
