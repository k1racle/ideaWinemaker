<script setup lang="ts">
const policies = await usePublicSiteDocument('policies')
const { cookiesPolicy } = policies

useHead({ title: toSeoTitle(cookiesPolicy.title), meta: [{ name: 'description', content: toSeoDescription(cookiesPolicy.description) }] })
</script>

<template><PolicyPage :document="cookiesPolicy" /></template>

