<script setup lang="ts">
import type { WineFilters } from '~~/shared/types'
import { wines } from '~~/shared/mock/wines'
import { winemakers } from '~~/shared/mock/winemakers'
import { terroirs } from '~~/shared/mock/terroirs'

const props = defineProps<{
  modelValue: WineFilters
  showNote?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: WineFilters]
  submit: []
}>()

const years = [...new Set(wines.map(wine => wine.meta.year))].sort((a, b) => b.localeCompare(a))
const methods = [...new Set(wines.map(wine => wine.meta.methodCode))]

const update = (key: keyof WineFilters, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="mt-7 text-left" @submit.prevent="emit('submit')">
    <div class="text-center text-[11px] uppercase tracking-[0.24em] text-primary">Уникальный код вина</div>
    <div class="mx-auto mt-7 flex max-w-[920px] items-stretch overflow-visible rounded-[40px] border border-border-strong max-[780px]:grid max-[780px]:grid-cols-2 max-[780px]:rounded-3xl max-[520px]:grid-cols-1">
      <div class="grid min-w-0 flex-1 grid-cols-5 max-[780px]:contents">
        <label class="relative cursor-pointer rounded-l-[40px] px-2.5 py-2.5 text-center transition-colors duration-200 hover:bg-ink/[0.05] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-px after:bg-border max-[780px]:rounded-none max-[780px]:rounded-tl-3xl max-[780px]:border-b max-[780px]:border-border max-[780px]:after:hidden max-[520px]:rounded-t-3xl">
          <span class="block text-sm font-medium uppercase tracking-[0.1em] text-primary">год урожая</span>
          <select :value="modelValue.year" class="mt-2.5 w-full cursor-pointer bg-transparent text-center font-serif text-[20px] uppercase tracking-[0.08em] text-primary outline-none" @change="update('year', ($event.target as HTMLSelectElement).value)">
            <option value="">Все</option><option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </label>
        <label class="relative cursor-pointer px-2.5 py-2.5 text-center transition-colors duration-200 hover:bg-ink/[0.05] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-px after:bg-border max-[780px]:border-b max-[780px]:border-border max-[780px]:after:hidden">
          <span class="block text-sm font-medium uppercase tracking-[0.1em] text-primary">терруар</span>
          <select :value="modelValue.terroir" class="mt-2.5 w-full cursor-pointer bg-transparent text-center font-serif text-[20px] uppercase tracking-[0.08em] text-primary outline-none" @change="update('terroir', ($event.target as HTMLSelectElement).value)">
            <option value="">Все</option><option v-for="terroir in terroirs" :key="terroir.slug" :value="terroir.slug">{{ terroir.meta.code }}</option>
          </select>
        </label>
        <label class="relative cursor-pointer px-2.5 py-2.5 text-center transition-colors duration-200 hover:bg-ink/[0.05] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-px after:bg-border max-[780px]:border-b max-[780px]:border-border max-[780px]:after:hidden">
          <span class="block text-sm font-medium uppercase tracking-[0.1em] text-primary">винодел</span>
          <select :value="modelValue.winemaker" class="mt-2.5 w-full cursor-pointer bg-transparent text-center font-serif text-[20px] uppercase tracking-[0.08em] text-primary outline-none" @change="update('winemaker', ($event.target as HTMLSelectElement).value)">
            <option value="">Все</option><option v-for="winemaker in winemakers" :key="winemaker.slug" :value="winemaker.slug">{{ winemaker.meta.initials }}</option>
          </select>
        </label>
        <label class="relative cursor-pointer px-2.5 py-2.5 text-center transition-colors duration-200 hover:bg-ink/[0.05] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-px after:bg-border max-[780px]:border-b max-[780px]:border-border max-[780px]:after:hidden">
          <span class="block text-sm font-medium uppercase tracking-[0.1em] text-primary">метод</span>
          <select :value="modelValue.method" class="mt-2.5 w-full cursor-pointer bg-transparent text-center font-serif text-[20px] uppercase tracking-[0.08em] text-primary outline-none" @change="update('method', ($event.target as HTMLSelectElement).value)">
            <option value="">Все</option><option v-for="method in methods" :key="method" :value="method">{{ method }}</option>
          </select>
        </label>
        <div class="px-2.5 py-2.5 text-center transition-colors duration-200 hover:bg-ink/[0.05] max-[780px]:border-b max-[780px]:border-border">
          <span class="block text-sm font-medium uppercase tracking-[0.1em] text-primary">номер / тираж</span>
          <div class="mt-2.5 font-serif text-[20px] uppercase tracking-[0.08em] text-primary">001 / 600</div>
        </div>
      </div>
      <button type="submit" aria-label="Применить фильтры" class="flex min-w-[90px] cursor-pointer items-center justify-center rounded-r-[40px] bg-primary text-canvas transition-colors duration-200 hover:bg-primary-hover max-[780px]:min-h-16 max-[780px]:rounded-none max-[780px]:rounded-br-3xl max-[520px]:rounded-b-3xl">
        <svg aria-hidden="true" viewBox="0 0 24 24" class="size-[22px] fill-none stroke-current" stroke-width="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 5 5" />
        </svg>
      </button>
    </div>
    <p v-if="showNote" class="mx-auto mt-8 max-w-[770px] text-center text-[15px] leading-relaxed text-ink/65">
      Каждая бутылка маркируется уникальным кодом, который объединяет данные о годе урожая, регионе, виноделе, технологическом решении, порядковом номере бутылки и объёме тиража. Код позволяет точно идентифицировать вино и проследить логику его создания.
    </p>
  </form>
</template>
