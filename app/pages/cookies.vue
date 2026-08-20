<script setup lang="ts">
const policies = await usePublicSiteDocument('policies')
const { cookiesPolicy } = policies

useHead({ title: `${cookiesPolicy.title} — Идея Винодела`, meta: [{ name: 'description', content: cookiesPolicy.description }] })
</script>

<template><PolicyPage :document="cookiesPolicy" /></template>

