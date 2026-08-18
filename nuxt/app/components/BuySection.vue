<script setup lang="ts">
import { partners } from '~~/shared/mock/commerce'

const selectedCity = ref('')
const selectedStoreId = ref<number>()
const { data: stores } = await usePublicStores()
const cities = computed(() => [...new Set(stores.value.map(store => store.city))])
const filteredStores = computed(() => selectedCity.value ? stores.value.filter(store => store.city === selectedCity.value) : stores.value)

watch(selectedCity, () => {
  selectedStoreId.value = undefined
})
</script>

<template>
  <section class="mt-[52px]">
    <SectionHeading title="Где купить" :level="3" centered />
    <div class="grid grid-cols-[minmax(210px,0.5fr)_minmax(230px,0.62fr)_minmax(0,1.38fr)] items-start gap-7 max-[1050px]:grid-cols-[minmax(210px,0.55fr)_minmax(0,1.45fr)] max-[720px]:grid-cols-1">
      <div class="grid gap-4 max-[720px]:grid-cols-3 max-[580px]:grid-cols-1">
        <a v-for="partner in partners" :key="partner.url" :href="partner.url" target="_blank" rel="noopener noreferrer" class="flex min-h-[126px] flex-col items-center justify-center rounded-[18px] border border-border-strong bg-canvas px-4 py-4 text-center transition hover:bg-surface/60 hover:shadow-sm">
          <img :src="partner.image" :alt="partner.name" loading="lazy" class="h-[64px] w-full object-contain">
          <span class="mt-2 text-[11px] uppercase tracking-[0.14em] text-primary">{{ partner.site }}</span>
        </a>
      </div>

      <div class="max-[1050px]:order-3 max-[1050px]:col-span-2 max-[720px]:order-none max-[720px]:col-span-1">
        <label class="mb-5 block text-[11px] uppercase tracking-[0.18em] text-primary">
          Город
          <select v-model="selectedCity" class="mt-2 block min-h-11 w-full rounded-xl border border-border-strong bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary">
            <option value="">Все города</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </label>
        <div class="max-h-[370px] space-y-3 overflow-y-auto pr-2">
          <article
            v-for="store in filteredStores"
            :id="`store-${store.id}`"
            :key="store.id"
            role="button"
            tabindex="0"
            :aria-pressed="selectedStoreId === store.id"
            class="scroll-mt-28 cursor-pointer rounded-[18px] border bg-canvas p-4 transition-[border-color,box-shadow] duration-200"
            :class="selectedStoreId === store.id
              ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/15'
              : 'border-border-strong hover:border-primary/45 hover:shadow-sm'"
            @click="selectedStoreId = store.id"
            @keydown.enter.prevent="selectedStoreId = store.id"
            @keydown.space.prevent="selectedStoreId = store.id"
          >
            <h4 class="font-serif text-xl leading-tight">{{ store.title }}</h4>
            <div class="mt-1 flex items-center justify-between gap-4">
              <p class="text-sm text-ink/65">{{ store.city }}, {{ store.address }}</p>
              <a
                :href="store.website"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Перейти на сайт ${store.title}`"
                class="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-canvas"
                @click.stop
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" class="size-4 fill-none stroke-current" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </div>

      <ClientOnly>
        <StoreMap v-model:selected-store-id="selectedStoreId" :stores="filteredStores" />
        <template #fallback><div class="h-[500px] animate-pulse bg-surface max-[700px]:h-[360px]" /></template>
      </ClientOnly>
    </div>
  </section>
</template>
