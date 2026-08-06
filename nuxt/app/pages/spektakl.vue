<script setup lang="ts">
import { spectaclePage } from '~~/shared/mock/pages'

useHead({ title: `${spectaclePage.title} — Идея Винодела`, meta: [{ name: 'description', content: spectaclePage.paragraphs[0] }] })
</script>

<template>
  <main class="pt-[52px]">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(34px,4.5vw,48px)] uppercase leading-[1.08] tracking-[0.06em]">{{ spectaclePage.title }}</h1>
        <div class="mx-auto mt-5 h-px w-20 bg-oak/65" />
      </section>
      <section class="mt-[52px] overflow-hidden"><img :src="spectaclePage.image" alt="Спектакль Идея винодела" class="max-h-[760px] w-full object-cover"></section>
      <section class="mx-auto mt-[52px] max-w-[960px] space-y-5 text-[17px] leading-[1.8]"><p v-for="paragraph in spectaclePage.paragraphs" :key="paragraph">{{ paragraph }}</p></section>
    </div>
  </main>
</template>

