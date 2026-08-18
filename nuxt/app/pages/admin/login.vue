<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const { loggedIn, fetch } = useUserSession()
if (loggedIn.value) await navigateTo('/admin')

const form = reactive({ login: '', password: '' })
const pending = ref(false)
const errorMessage = ref('')

const submit = async () => {
  pending.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: form })
    await fetch()
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin')
      ? route.query.redirect
      : '/admin'
    await navigateTo(redirect)
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'Не удалось войти')
  } finally {
    pending.value = false
  }
}

useHead({ title: 'Вход в админ-панель — Идея Винодела' })
</script>

<template>
  <main class="container-iw flex min-h-[calc(100vh-65px)] items-center justify-center py-12">
    <form class="w-full max-w-md rounded-3xl border border-border bg-canvas p-8 shadow-sm" @submit.prevent="submit">
      <h1 class="font-serif text-4xl">Вход</h1>
      <p class="mt-2 text-sm text-ink/60">Управление виноделами и винами.</p>
      <div class="mt-7 space-y-5">
        <label class="block">
          <span class="mb-2 block text-xs uppercase tracking-[0.12em] text-primary">Логин</span>
          <input v-model.trim="form.login" autocomplete="username" required class="min-h-12 w-full rounded-xl border border-border-strong px-4 outline-none focus:border-primary">
        </label>
        <label class="block">
          <span class="mb-2 block text-xs uppercase tracking-[0.12em] text-primary">Пароль</span>
          <input v-model="form.password" type="password" autocomplete="current-password" required class="min-h-12 w-full rounded-xl border border-border-strong px-4 outline-none focus:border-primary">
        </label>
      </div>
      <p v-if="errorMessage" role="alert" class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>
      <button type="submit" :disabled="pending" class="mt-6 min-h-12 w-full cursor-pointer rounded-full bg-primary px-6 text-sm uppercase tracking-[0.14em] text-canvas disabled:cursor-not-allowed disabled:opacity-55">
        {{ pending ? 'Вход…' : 'Войти' }}
      </button>
    </form>
  </main>
</template>
