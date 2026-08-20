<script setup lang="ts">
const policies = await usePublicSiteDocument('policies')
const { privacyPolicy } = policies

useHead({
  title: toSeoTitle(privacyPolicy.title),
  meta: [{ name: 'description', content: toSeoDescription(privacyPolicy.description) }],
})
</script>

<template><PolicyPage :document="privacyPolicy" /></template>
