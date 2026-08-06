<script setup lang="ts">
import { mainMenu, siteName } from '~~/shared/mock/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-[72px] border-t border-line-strong bg-white pb-[52px] pt-[34px] text-black">
    <div class="container-iw flex flex-col items-center text-center">
      <NuxtLink to="/" class="font-serif text-[20px] font-normal uppercase leading-none tracking-[0.24em] text-black">
        {{ siteName }}
      </NuxtLink>

      <nav class="mt-7 flex w-full justify-center" aria-label="Меню в подвале сайта">
        <ul class="m-0 flex list-none flex-row flex-wrap items-center justify-center gap-x-6 gap-y-3 p-0">
          <li v-for="item in mainMenu" :key="item.url" class="m-0 list-none p-0">
            <NuxtLink
              :to="item.url"
              class="inline-block text-[11px] uppercase leading-none tracking-[0.14em] text-black/75 no-underline transition-colors duration-200 hover:text-bordeaux"
            >{{ item.title }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] uppercase leading-none tracking-[0.14em] text-black/75">
        <a href="tel:+79385065363" class="transition-colors duration-200 hover:text-bordeaux">+7 938 506 53 63</a>
        <a href="mailto:ideyavinodela@yandex.ru" class="transition-colors duration-200 hover:text-bordeaux">IDEYAVINODELA@YANDEX.RU</a>
      </div>

      <div class="mt-7 h-px w-full max-w-[360px] bg-line-strong" />

      <div class="mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[10px] leading-normal text-black/55">
        <NuxtLink to="/privacy-policy" class="transition-colors hover:text-bordeaux">Политика конфиденциальности</NuxtLink>
        <NuxtLink to="/cookies" class="transition-colors hover:text-bordeaux">Политика cookies</NuxtLink>
      </div>

      <p class="mt-2.5 text-[10px] leading-relaxed text-black/55">
        * Instagram принадлежит компании Meta, признанной экстремистской организацией и запрещенной в РФ
      </p>

      <p class="mt-2.5 text-[11px] leading-normal text-black/60">© {{ year }} {{ siteName }}. Все права защищены.</p>
    </div>
  </footer>
</template>
