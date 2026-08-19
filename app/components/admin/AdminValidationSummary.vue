<script setup lang="ts">
defineProps<{
  errors: string[]
}>()
</script>

<template>
  <section v-if="errors.length" role="alert" aria-live="polite" class="mt-6 max-w-5xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-900">
    <h2 class="font-medium">Не удалось сохранить запись</h2>
    <p class="mt-1 text-sm text-red-800">Проверьте обязательные поля:</p>
    <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </section>
</template>
