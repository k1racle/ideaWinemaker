<script setup lang="ts">
import { headerSocials } from '~~/shared/mock/site'
</script>

<template>
  <section class="mt-[52px]">
    <SectionHeading title="Соцсети" :level="3" centered />
    <div class="flex flex-wrap justify-center gap-3.5">
      <a v-for="social in headerSocials" :key="social.name" :href="social.url" target="_blank" rel="noopener noreferrer" :aria-label="social.name" class="flex min-h-[110px] basis-[120px] flex-col items-center justify-center gap-2 px-2.5 py-3.5 text-center">
        <span class="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-surface-accent"><img :src="social.icon" :alt="social.name" class="h-6 w-6 object-contain"></span>
      </a>
    </div>
  </section>
</template>
