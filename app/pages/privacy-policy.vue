<script setup lang="ts">
const policies = await usePublicSiteDocument('policies')
const { privacyPolicy } = policies

useHead({
  title: `${privacyPolicy.title} — Идея Винодела`,
  meta: [{ name: 'description', content: privacyPolicy.description }],
})
</script>

<template><PolicyPage :document="privacyPolicy" /></template>
