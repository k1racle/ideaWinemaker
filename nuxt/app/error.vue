<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const status = computed(() => props.error.status || 500)
const is404 = computed(() => status.value === 404)

useHead({ title: is404.value ? 'Страница не найдена — Идея Винодела' : 'Ошибка — Идея Винодела' })
</script>

<template>
  <NuxtLayout>
    <main>
      <div class="container-iw py-20 text-center">
        <div class="font-serif text-[120px] leading-none text-secondary max-[600px]:text-[84px]">{{ status }}</div>
        <div class="mx-auto my-6 h-px w-20 bg-secondary" />
        <h1 class="font-serif text-[28px]">{{ is404 ? 'Страница не найдена' : 'Что-то пошло не так' }}</h1>
        <p class="mx-auto mt-4 max-w-[500px] text-ink/60">{{ is404 ? 'К сожалению, страница, которую вы ищете, не существует или была перемещена.' : 'Попробуйте вернуться на главную страницу.' }}</p>
        <button type="button" class="mt-8 rounded-full border border-border-strong px-6 py-3 text-xs uppercase tracking-[0.16em] text-primary" @click="clearError({ redirect: '/' })">Вернуться на главную →</button>
      </div>
    </main>
  </NuxtLayout>
</template>
