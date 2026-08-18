<template>
  <div class="min-h-screen bg-surface text-ink">
    <header class="border-b border-border bg-canvas">
      <div class="container-iw flex min-h-16 items-center justify-between gap-5">
        <NuxtLink to="/admin" class="font-serif text-xl uppercase tracking-[0.12em]">Админ-панель</NuxtLink>
        <NuxtLink to="/" class="text-xs uppercase tracking-[0.16em] text-primary">Открыть сайт</NuxtLink>
      </div>
    </header>
    <slot />
  </div>
</template>
