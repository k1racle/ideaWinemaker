<script setup lang="ts">
import { headerSocials, mainMenu } from '~~/shared/mock/site'

const route = useRoute()
const isActive = (url: string) => (url === '/' ? route.path === '/' : route.path.startsWith(url))

// Mobile menu state (replaces mobile-menu.js; body class kept from the theme)
const menuOpen = ref(false)

watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.body.classList.toggle('mobile-menu-open', open)
  }
})
watch(() => route.fullPath, () => {
  menuOpen.value = false
})
onUnmounted(() => {
  if (import.meta.client) {
    document.body.classList.remove('mobile-menu-open')
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
    <div class="container-iw grid grid-cols-[15%_70%_15%] items-center justify-between py-[18px]">
      <div class="flex items-center gap-3 whitespace-nowrap">
        <NuxtLink to="/" aria-label="ИДЕЯ ВИНОДЕЛА" class="block">
          <img
            src="/uploads/2026/04/main-logo-scaled.png"
            alt="ИДЕЯ ВИНОДЕЛА"
            class="h-auto max-h-12 w-auto max-w-full nav:max-h-10"
          >
        </NuxtLink>
      </div>

      <nav class="flex flex-wrap items-center justify-center gap-[26px] text-[11px] uppercase tracking-[0.22em] max-nav:hidden">
        <NuxtLink
          v-for="item in mainMenu"
          :key="item.url"
          :to="item.url"
          class="opacity-[0.78] transition duration-200 hover:text-bordeaux hover:opacity-100"
          :class="{ 'text-bordeaux opacity-100': isActive(item.url) }"
        >{{ item.title }}</NuxtLink>
      </nav>

      <button
        type="button"
        aria-label="Открыть меню"
        :aria-expanded="menuOpen"
        aria-controls="mobileMenu"
        class="mr-[-19%] hidden h-[42px] w-[42px] cursor-pointer flex-col items-center justify-center gap-[5px] justify-self-end rounded-[10px] border border-line-strong bg-white nav:hidden"
        @click="menuOpen = true"
      >
        <span v-for="i in 3" :key="i" class="block h-[2px] w-[18px] bg-black transition-transform duration-250" />
      </button>

      <div
        id="mobileMenu"
        class="fixed inset-0 z-[90] transition-opacity duration-300"
        :class="menuOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'"
        :aria-hidden="!menuOpen"
      >
        <div
          class="absolute inset-0 bg-black/35 transition-opacity duration-300"
          :class="menuOpen ? 'opacity-100' : 'opacity-0'"
          @click="menuOpen = false"
        />
        <aside
          class="absolute right-0 top-0 flex h-dvh w-[min(88vw,360px)] max-w-full flex-col gap-[18px] overflow-y-auto border-l border-line bg-white px-5 py-6 transition-transform duration-350"
          :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
        >
          <NuxtLink to="/" aria-label="ИДЕЯ ВИНОДЕЛА" class="block max-w-[230px]">
            <img
              src="/uploads/2026/04/main-logo-scaled.png"
              alt="ИДЕЯ ВИНОДЕЛА"
              class="h-auto max-h-10 w-auto max-w-full"
            >
          </NuxtLink>
          <button
            type="button"
            aria-label="Закрыть меню"
            class="relative h-[42px] w-[42px] self-end rounded-lg border border-line-strong bg-white"
            @click="menuOpen = false"
          >
            <span class="absolute inset-x-2 top-1/2 h-[2px] rotate-45 bg-black" />
            <span class="absolute inset-x-2 top-1/2 h-[2px] -rotate-45 bg-black" />
          </button>

          <nav class="grid gap-3 text-[13px] uppercase tracking-[0.12em]">
            <NuxtLink
              v-for="item in mainMenu"
              :key="item.url"
              :to="item.url"
              class="block border-b border-line py-2.5 leading-snug opacity-90"
              :class="{ 'text-bordeaux opacity-100': isActive(item.url) }"
            >{{ item.title }}</NuxtLink>
          </nav>

          <div class="mt-auto flex flex-wrap items-center gap-3.5">
            <a
              v-for="social in headerSocials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
              class="inline-flex h-[46px] w-[46px] items-center justify-center"
            >
              <span class="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#f4f6fa]">
                <img :src="social.icon" :alt="social.name" loading="lazy" class="h-6 w-6 object-contain">
              </span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  </header>
</template>
