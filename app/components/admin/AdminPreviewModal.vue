<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const showHints = ref(true)
let previousBodyOverflow = ''

const close = () => emit('update:modelValue', false)
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) close()
}

watch(() => props.modelValue, (isOpen) => {
  if (!import.meta.client) return
  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = previousBodyOverflow
  }
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] bg-ink/65 p-2 backdrop-blur-sm sm:p-5"
        @mousedown.self="close"
      >
        <section
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          class="mx-auto flex h-full max-w-[1440px] flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl"
        >
          <header class="z-10 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-canvas px-5 py-4 sm:px-7">
            <div>
              <p class="text-[10px] uppercase tracking-[0.18em] text-primary">Живой предпросмотр</p>
              <h2 class="mt-1 font-serif text-2xl sm:text-3xl">{{ title }}</h2>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <label class="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-xs">
                <input v-model="showHints" type="checkbox" class="size-4 accent-primary">
                Подписи полей
              </label>
              <button
                type="button"
                class="flex size-10 cursor-pointer items-center justify-center rounded-full bg-ink text-xl text-canvas"
                aria-label="Закрыть предпросмотр"
                @click="close"
              >
                ×
              </button>
            </div>
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto">
            <slot :show-hints="showHints" />
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
