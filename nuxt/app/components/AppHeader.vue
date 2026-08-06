<script setup lang="ts">
import { headerSocials, mainMenu } from '~~/shared/mock/site'

const route = useRoute()
const isActive = (url: string) => (url === '/' ? route.path === '/' : route.path.startsWith(url))

// Mobile menu state (replaces mobile-menu.js; body class kept from the theme)
const menuOpen = ref(false)

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') menuOpen.value = false
}

watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.body.classList.toggle('mobile-menu-open', open)
  }
})
watch(() => route.fullPath, () => {
  menuOpen.value = false
})

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})
onUnmounted(() => {
  if (import.meta.client) window.removeEventListener('keydown', handleEscape)
  if (import.meta.client) {
    document.body.classList.remove('mobile-menu-open')
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
    <div class="container-iw grid grid-cols-[15%_70%_15%] items-center justify-between py-[18px] max-nav:grid-cols-[minmax(0,1fr)_auto] max-nav:py-[14px]">
      <div class="flex min-w-0 items-center gap-3 whitespace-nowrap">
        <NuxtLink to="/" aria-label="ИДЕЯ ВИНОДЕЛА" class="block max-nav:max-w-[220px]">
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
        :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
        :aria-expanded="menuOpen"
        aria-controls="mobileMenu"
        class="relative hidden size-[42px] cursor-pointer justify-self-end rounded-[10px] border border-line-strong bg-white nav:hidden max-nav:block"
        @click="menuOpen = !menuOpen"
      >
        <span
          class="absolute left-1/2 h-[2px] w-5 -translate-x-1/2 bg-black transition-all duration-300"
          :class="menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[13px]'"
        />
        <span
          class="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 bg-black transition-all duration-300"
          :class="menuOpen ? 'opacity-0' : 'opacity-100'"
        />
        <span
          class="absolute left-1/2 h-[2px] w-5 -translate-x-1/2 bg-black transition-all duration-300"
          :class="menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[27px]'"
        />
      </button>
    </div>
  </header>

  <Teleport to="body">
    <div
      id="mobileMenu"
      class="fixed inset-x-0 bottom-0 top-[71px] z-40 hidden bg-white transition-all duration-300 nav:hidden max-nav:block"
      :class="menuOpen ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-2 opacity-0'"
      :aria-hidden="!menuOpen"
    >
      <div
        class="container-iw flex h-full flex-col overflow-y-auto pb-6 pt-8"
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
      >
        <nav class="grid text-left font-sans text-[16px] uppercase leading-none tracking-[0.14em]">
          <NuxtLink
            v-for="item in mainMenu"
            :key="item.url"
            :to="item.url"
            class="border-b border-line py-4 transition-colors duration-200"
            :class="isActive(item.url) ? 'text-bordeaux' : 'text-black'"
          >{{ item.title }}</NuxtLink>
        </nav>

        <div class="mt-auto pt-8">
          <p class="mb-4 text-center text-[10px] uppercase tracking-[0.18em] text-black/50">Мы в социальных сетях</p>
          <div class="flex flex-wrap items-center justify-center gap-2.5">
            <a
              v-for="social in headerSocials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
              class="inline-flex size-10 items-center justify-center rounded-xl bg-[#f4f6fa] transition-colors hover:bg-paper"
            >
              <img :src="social.icon" :alt="social.name" loading="lazy" class="size-[22px] object-contain">
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
