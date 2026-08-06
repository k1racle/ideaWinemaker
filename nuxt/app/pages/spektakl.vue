<script setup lang="ts">
import { spectaclePage } from '~~/shared/mock/pages'

useHead({ title: `${spectaclePage.title} — Идея Винодела`, meta: [{ name: 'description', content: spectaclePage.paragraphs[0] }] })
</script>

<template>
  <main class="pt-[52px]">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(34px,4.5vw,48px)] uppercase leading-[1.08] tracking-[0.06em]">
          Иммерсивный эногастрономический спектакль <strong class="font-bold">«Идея винодела»</strong>
        </h1>
        <div class="mx-auto mt-5 h-px w-20 bg-secondary/65" />
      </section>
      <section class="mt-[52px] overflow-hidden"><img :src="spectaclePage.image" alt="Спектакль Идея винодела" class="max-h-[760px] w-full object-cover"></section>
      <section class="mt-[52px] w-full space-y-5 text-justify text-[17px] leading-[1.8] max-[700px]:text-left">
        <p v-for="paragraph in spectaclePage.paragraphs" :key="paragraph">
          <template v-for="(part, index) in paragraph.split('«ИДЕЯ ВИНОДЕЛА»')" :key="`${index}-${part}`">
            <strong v-if="index > 0" class="font-bold">«ИДЕЯ ВИНОДЕЛА»</strong>{{ part }}
          </template>
        </p>
      </section>
    </div>
  </main>
</template>
