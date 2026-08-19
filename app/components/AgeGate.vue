<script setup lang="ts">
type AgeGateState = 'question' | 'denied' | 'allowed'

const ageConfirmation = useCookie<string | null>('iw_age_confirmed', {
  default: () => null,
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
  sameSite: 'lax',
})

const state = ref<AgeGateState>(ageConfirmation.value === 'yes' ? 'allowed' : 'question')
const dialog = useTemplateRef<HTMLElement>('dialog')
const isVisible = computed(() => state.value !== 'allowed')

let previousBodyOverflow = ''

const focusDialog = async () => {
  await nextTick()
  dialog.value?.focus()
}

watch(isVisible, async (visible) => {
  if (!import.meta.client) {
    return
  }

  if (visible) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await focusDialog()
  } else {
    document.body.style.overflow = previousBodyOverflow
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = previousBodyOverflow
  }
})

const confirmAge = () => {
  ageConfirmation.value = 'yes'
  state.value = 'allowed'
}

const denyAccess = async () => {
  state.value = 'denied'
  await focusDialog()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/75 px-5 py-8 backdrop-blur-sm"
    >
      <section
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="state === 'question' ? 'age-gate-title' : 'age-denied-title'"
        tabindex="-1"
        class="w-full max-w-[560px] rounded-2xl border border-secondary/30 bg-canvas px-7 py-9 text-center shadow-2xl outline-none sm:px-12 sm:py-12"
      >
        <div class="mx-auto flex size-20 items-center justify-center rounded-full border border-secondary text-3xl font-semibold text-primary">
          18+
        </div>

        <template v-if="state === 'question'">
          <h2 id="age-gate-title" class="mt-7 font-serif text-[clamp(32px,7vw,44px)] leading-tight text-ink">
            Вам уже исполнилось 18 лет?
          </h2>
          <p class="mx-auto mt-4 max-w-[430px] text-[15px] leading-relaxed text-copy">
            Сайт содержит информацию об алкогольной продукции и предназначен только для совершеннолетних пользователей.
          </p>
          <div class="mt-8 grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
            <button
              type="button"
              class="min-h-12 cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="confirmAge"
            >
              Да
            </button>
            <button
              type="button"
              class="min-h-12 cursor-pointer rounded-full border border-border-strong bg-canvas px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="denyAccess"
            >
              Нет
            </button>
          </div>
        </template>

        <template v-else>
          <h2 id="age-denied-title" class="mt-7 font-serif text-[clamp(32px,7vw,44px)] leading-tight text-ink">
            Доступ запрещён
          </h2>
          <p class="mx-auto mt-4 max-w-[430px] text-[15px] leading-relaxed text-copy">
            Просмотр материалов сайта разрешён только пользователям старше 18 лет.
          </p>
        </template>
      </section>
    </div>
  </Teleport>
</template>
