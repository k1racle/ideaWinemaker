<script setup lang="ts">
import type { AdminContentOverview } from '~~/shared/types/content'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { user, fetch: refreshSession } = useUserSession()
const { data: overview, refresh } = await useFetch<AdminContentOverview>('/api/admin/content', {
  key: 'admin-content',
  default: () => ({ wineries: [], stores: [], winemakers: [], terroirs: [], wines: [] }),
})
const pendingVisibility = ref('')
const errorMessage = ref('')

const toggleVisibility = async (kind: 'wineries' | 'stores' | 'winemakers' | 'terroirs' | 'wines', id: number, isVisible: boolean) => {
  const key = `${kind}-${id}`
  pendingVisibility.value = key
  errorMessage.value = ''
  try {
    await $fetch(`/api/admin/${kind}/${id}/visibility`, {
      method: 'PATCH',
      body: { isVisible: !isVisible },
    })
    await refresh()
    await refreshNuxtData(['public-wines', 'public-winemakers', 'public-terroirs', 'public-stores'])
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'Не удалось изменить видимость')
  } finally {
    pendingVisibility.value = ''
  }
}

const logout = async () => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await refreshSession()
  await navigateTo('/admin/login')
}

useHead({ title: 'Админ-панель — Идея Винодела' })
</script>

<template>
  <main class="container-iw py-10">
    <div class="flex flex-wrap items-start justify-between gap-5">
      <div>
        <h1 class="font-serif text-[clamp(36px,5vw,52px)]">Контент</h1>
        <p class="mt-1 text-sm text-ink/60">Выполнен вход: {{ user?.login }}</p>
      </div>
      <button type="button" class="cursor-pointer rounded-full border border-border-strong px-5 py-2 text-xs uppercase tracking-[0.12em]" @click="logout">Выйти</button>
    </div>

    <p v-if="errorMessage" role="alert" class="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

    <section class="mt-9">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="font-serif text-3xl">Винодельни — {{ overview.wineries.length }}</h2>
        <NuxtLink to="/admin/wineries/new" class="rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.12em] text-canvas">Добавить винодельню</NuxtLink>
      </div>
      <div class="mt-5 overflow-x-auto rounded-2xl border border-border bg-canvas">
        <table class="w-full min-w-[980px] text-left text-sm">
          <thead class="border-b border-border bg-surface text-xs uppercase tracking-[0.1em] text-primary"><tr><th class="p-4">Винодельня</th><th class="p-4">Slug</th><th class="p-4">Регион</th><th class="p-4">Год основания</th><th class="p-4">Статус</th><th class="p-4" /></tr></thead>
          <tbody>
            <tr v-for="item in overview.wineries" :key="item.id" class="border-b border-border last:border-0">
              <td class="p-4 font-medium">{{ item.title }}</td>
              <td class="p-4 text-ink/55">{{ item.slug }}</td>
              <td class="p-4">{{ item.region }}</td>
              <td class="p-4">{{ item.foundedYear || '—' }}</td>
              <td class="p-4"><span :class="item.isVisible ? 'text-green-700' : 'text-ink/45'">{{ item.isVisible ? 'Показывается' : 'Скрыта' }}</span></td>
              <td class="p-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink :to="`/admin/wineries/${item.id}/edit`" class="rounded-full border border-primary px-4 py-2 text-xs text-primary">Редактировать</NuxtLink>
                  <button type="button" :disabled="pendingVisibility === `wineries-${item.id}`" class="cursor-pointer rounded-full border border-border-strong px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50" @click="toggleVisibility('wineries', item.id, item.isVisible)">{{ item.isVisible ? 'Скрыть' : 'Показать' }}</button>
                </div>
              </td>
            </tr>
            <tr v-if="!overview.wineries.length"><td colspan="6" class="p-6 text-center text-ink/45">Винодельни ещё не добавлены.</td></tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-ink/55">Записи хранятся отдельно в SQLite и пока не выводятся на публичном сайте.</p>
    </section>

    <section class="mt-12">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="font-serif text-3xl">Точки магазинов — {{ overview.stores.length }}</h2>
        <NuxtLink to="/admin/stores/new" class="rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.12em] text-canvas">Добавить точку</NuxtLink>
      </div>
      <div class="mt-5 overflow-x-auto rounded-2xl border border-border bg-canvas">
        <table class="w-full min-w-[1080px] text-left text-sm">
          <thead class="border-b border-border bg-surface text-xs uppercase tracking-[0.1em] text-primary"><tr><th class="p-4">Магазин</th><th class="p-4">Город</th><th class="p-4">Адрес</th><th class="p-4">Координаты</th><th class="p-4">Статус</th><th class="p-4" /></tr></thead>
          <tbody>
            <tr v-for="item in overview.stores" :key="item.id" class="border-b border-border last:border-0">
              <td class="p-4 font-medium"><a :href="item.website" target="_blank" rel="noopener noreferrer" class="text-primary underline decoration-primary/30 underline-offset-4">{{ item.title }}</a></td>
              <td class="p-4">{{ item.city }}</td>
              <td class="p-4">{{ item.address }}</td>
              <td class="p-4 font-mono text-xs text-ink/55">{{ item.coordinates.join(', ') }}</td>
              <td class="p-4"><span :class="item.isVisible ? 'text-green-700' : 'text-ink/45'">{{ item.isVisible ? 'Показывается' : 'Скрыта' }}</span></td>
              <td class="p-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink :to="`/admin/stores/${item.id}/edit`" class="rounded-full border border-primary px-4 py-2 text-xs text-primary">Редактировать</NuxtLink>
                  <button type="button" :disabled="pendingVisibility === `stores-${item.id}`" class="cursor-pointer rounded-full border border-border-strong px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50" @click="toggleVisibility('stores', item.id, item.isVisible)">{{ item.isVisible ? 'Скрыть' : 'Показать' }}</button>
                </div>
              </td>
            </tr>
            <tr v-if="!overview.stores.length"><td colspan="6" class="p-6 text-center text-ink/45">Точки магазинов ещё не добавлены.</td></tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-ink/55">Видимые точки используются в блоке «Где купить» и на карте; скрытые остаются только в админке.</p>
    </section>

    <section class="mt-12">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="font-serif text-3xl">Виноделы — {{ overview.winemakers.length }}</h2>
        <NuxtLink to="/admin/winemakers/new" class="rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.12em] text-canvas">Добавить винодела</NuxtLink>
      </div>
      <div class="mt-5 overflow-x-auto rounded-2xl border border-border bg-canvas">
        <table class="w-full min-w-[820px] text-left text-sm">
          <thead class="border-b border-border bg-surface text-xs uppercase tracking-[0.1em] text-primary"><tr><th class="p-4">Винодел</th><th class="p-4">Slug</th><th class="p-4">Вин</th><th class="p-4">Статус</th><th class="p-4" /></tr></thead>
          <tbody>
            <tr v-for="item in overview.winemakers" :key="item.id" class="border-b border-border last:border-0">
              <td class="p-4 font-medium">{{ item.title }}</td><td class="p-4 text-ink/55">{{ item.slug }}</td><td class="p-4">{{ item.winesCount }}</td>
              <td class="p-4"><span :class="item.isVisible ? 'text-green-700' : 'text-ink/45'">{{ item.isVisible ? 'Показывается' : 'Скрыт' }}</span></td>
              <td class="p-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink :to="`/admin/winemakers/${item.id}/edit`" class="rounded-full border border-primary px-4 py-2 text-xs text-primary">Редактировать</NuxtLink>
                  <button type="button" :disabled="pendingVisibility === `winemakers-${item.id}`" class="cursor-pointer rounded-full border border-border-strong px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50" @click="toggleVisibility('winemakers', item.id, item.isVisible)">{{ item.isVisible ? 'Скрыть' : 'Показать' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-ink/55">Скрытый винодел временно скрывает на публичном сайте и все связанные с ним вина.</p>
    </section>

    <section class="mt-12">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="font-serif text-3xl">Терруары — {{ overview.terroirs.length }}</h2>
        <NuxtLink to="/admin/terroirs/new" class="rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.12em] text-canvas">Добавить терруар</NuxtLink>
      </div>
      <div class="mt-5 overflow-x-auto rounded-2xl border border-border bg-canvas">
        <table class="w-full min-w-[820px] text-left text-sm">
          <thead class="border-b border-border bg-surface text-xs uppercase tracking-[0.1em] text-primary"><tr><th class="p-4">Терруар</th><th class="p-4">Код</th><th class="p-4">Вин</th><th class="p-4">Статус</th><th class="p-4" /></tr></thead>
          <tbody>
            <tr v-for="item in overview.terroirs" :key="item.id" class="border-b border-border last:border-0">
              <td class="p-4"><div class="font-medium">{{ item.title }}</div><div class="mt-1 text-xs text-ink/45">{{ item.slug }}</div></td>
              <td class="p-4 font-serif text-xl text-primary">{{ item.code }}</td>
              <td class="p-4">{{ item.winesCount }}</td>
              <td class="p-4"><span :class="item.isVisible ? 'text-green-700' : 'text-ink/45'">{{ item.isVisible ? 'Показывается' : 'Скрыт' }}</span></td>
              <td class="p-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink :to="`/admin/terroirs/${item.id}/edit`" class="rounded-full border border-primary px-4 py-2 text-xs text-primary">Редактировать</NuxtLink>
                  <button type="button" :disabled="pendingVisibility === `terroirs-${item.id}`" class="cursor-pointer rounded-full border border-border-strong px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50" @click="toggleVisibility('terroirs', item.id, item.isVisible)">{{ item.isVisible ? 'Скрыть' : 'Показать' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-ink/55">Скрытый терруар временно скрывает на публичном сайте все связанные с ним вина.</p>
    </section>

    <section class="mt-12">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="font-serif text-3xl">Вина — {{ overview.wines.length }}</h2>
        <NuxtLink to="/admin/wines/new" class="rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.12em] text-canvas">Добавить вино</NuxtLink>
      </div>
      <div class="mt-5 overflow-x-auto rounded-2xl border border-border bg-canvas">
        <table class="w-full min-w-[920px] text-left text-sm">
          <thead class="border-b border-border bg-surface text-xs uppercase tracking-[0.1em] text-primary"><tr><th class="p-4">Вино</th><th class="p-4">Сорт</th><th class="p-4">Винодел</th><th class="p-4">Статус</th><th class="p-4" /></tr></thead>
          <tbody>
            <tr v-for="item in overview.wines" :key="item.id" class="border-b border-border last:border-0">
              <td class="p-4"><div class="font-medium">{{ item.title }}</div><div class="mt-1 text-xs text-ink/45">{{ item.slug }}</div></td><td class="p-4">{{ item.variety }}</td><td class="p-4">{{ item.winemakerTitle }}</td>
              <td class="p-4"><span :class="item.isVisible ? 'text-green-700' : 'text-ink/45'">{{ item.isVisible ? 'Показывается' : 'Скрыто' }}</span></td>
              <td class="p-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink :to="`/admin/wines/${item.id}/edit`" class="rounded-full border border-primary px-4 py-2 text-xs text-primary">Редактировать</NuxtLink>
                  <button type="button" :disabled="pendingVisibility === `wines-${item.id}`" class="cursor-pointer rounded-full border border-border-strong px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50" @click="toggleVisibility('wines', item.id, item.isVisible)">{{ item.isVisible ? 'Скрыть' : 'Показать' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
