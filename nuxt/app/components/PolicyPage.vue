<script setup lang="ts">
import type { PolicyDocument } from '~~/shared/mock/policies'

defineProps<{ document: PolicyDocument }>()
</script>

<template>
  <main class="pt-[52px]">
    <div class="container-iw">
      <section class="text-center">
        <h1 class="font-serif text-[clamp(34px,4.5vw,48px)] uppercase leading-[1.05] tracking-[0.08em]">{{ document.title }}</h1>
        <div class="mx-auto mt-5 h-px w-20 bg-secondary/65" />
        <!-- <p v-if="document.description" class="mx-auto mt-4 max-w-[900px] text-ink/70">{{ document.description }}</p> -->
      </section>
      <article class="mx-auto mt-6 max-w-[1080px] text-left text-[17px] leading-[1.8] text-ink/85">
        <section v-for="section in document.sections" :key="section.title" class="mt-10 first:mt-0">
          <h2 class="font-serif text-[clamp(26px,3vw,34px)] uppercase leading-[1.08] tracking-[0.08em]">{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph" class="mt-4 whitespace-pre-wrap">{{ paragraph }}</p>
          <ul v-if="section.items" class="mt-4 list-disc space-y-2 pl-7"><li v-for="item in section.items" :key="item">{{ item }}</li></ul>
        </section>
      </article>
    </div>
  </main>
</template>
