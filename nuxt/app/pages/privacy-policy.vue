<script setup lang="ts">
import { privacyPolicy } from '~~/shared/mock/policies'

useHead({
  title: `${privacyPolicy.title} — Идея Винодела`,
  meta: [{ name: 'description', content: privacyPolicy.title }],
})
</script>

<template><PolicyPage :document="privacyPolicy" /></template>
