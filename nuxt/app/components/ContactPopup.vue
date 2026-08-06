<script setup lang="ts">
// Contact popup (replaces the Contact Form 7 popup + script.js wiring).
// Submit is a mock for the preview — will post to a Nuxt server route later.
const { isOpen, close } = useContactPopup()

const sent = ref(false)
const name = ref('')
const phone = ref('')

const submit = () => {
  // Preview-only mock of a successful CF7 submission
  sent.value = true
}

const resetAndClose = () => {
  close()
  // let the close transition finish before resetting the form state
  setTimeout(() => {
    sent.value = false
  }, 250)
}

useEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isOpen.value) resetAndClose()
})

watch(isOpen, (open) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<template>
  <div
    id="contact-popup"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-6 transition-[opacity,visibility] duration-200"
    :class="isOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'"
    :aria-hidden="!isOpen"
  >
    <div class="absolute inset-0 bg-[rgba(28,23,22,0.55)]" @click="resetAndClose" />

    <div
      class="relative z-[1] max-h-[calc(100vh-64px)] w-[min(100%,560px)] overflow-y-auto rounded-3xl bg-white px-5 py-[18px] shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-popup-title"
    >
      <button
        type="button"
        aria-label="Закрыть форму"
        class="absolute right-3.5 top-3.5 h-10 w-10 cursor-pointer rounded-full border-0 bg-black/[0.04] text-[28px] leading-none text-black transition duration-200 hover:bg-bordeaux/[0.08] hover:text-bordeaux"
        @click="resetAndClose"
      >&times;</button>

      <h2 id="contact-popup-title" class="mb-1 mt-0 text-center font-serif text-[28px] leading-none text-black">
        Связаться с нами
      </h2>

      <div
        v-if="sent"
        class="mt-2 rounded-2xl border border-olive/35 bg-olive/[0.08] px-3 py-2.5 text-center text-[13px] leading-normal text-[#405034]"
        aria-live="polite"
      >
        Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
      </div>

      <div v-else class="mt-2.5">
        <form class="grid gap-1.5" @submit.prevent="submit">
          <p class="m-0">
            <label class="grid gap-1 text-[11px] uppercase leading-[1.3] tracking-[0.12em] text-bordeaux">
              Ваше имя
              <input
                v-model="name"
                type="text"
                name="your-name"
                autocomplete="name"
                required
                class="w-full rounded-xl border border-line-strong bg-[#fcfbfa] px-3.5 py-2.5 text-[15px] leading-[1.35] text-black outline-none transition duration-200 placeholder:text-black/40 focus:border-bordeaux"
              >
            </label>
          </p>
          <p class="m-0">
            <label class="grid gap-1 text-[11px] uppercase leading-[1.3] tracking-[0.12em] text-bordeaux">
              Телефон
              <input
                v-model="phone"
                v-imask="{ mask: '+7 (000) 000-00-00' }"
                type="tel"
                name="your-phone"
                autocomplete="tel"
                placeholder="+7 (___) ___-__-__"
                class="w-full rounded-xl border border-line-strong bg-[#fcfbfa] px-3.5 py-2.5 text-[15px] leading-[1.35] text-black outline-none transition duration-200 placeholder:text-black/40 focus:border-bordeaux"
              >
            </label>
          </p>
          <p class="m-0 mt-2 text-center">
            <button
              type="submit"
              class="inline-block cursor-pointer rounded-xl border-0 bg-bordeaux px-8 py-3 text-[12px] uppercase tracking-[0.18em] text-white transition duration-200 hover:bg-black"
            >Отправить</button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
