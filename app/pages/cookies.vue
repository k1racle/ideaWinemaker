<script setup lang="ts">
import { cookiesPolicy } from '~~/shared/mock/policies'

useHead({ title: `${cookiesPolicy.title} — Идея Винодела`, meta: [{ name: 'description', content: cookiesPolicy.description }] })
</script>

<template><PolicyPage :document="cookiesPolicy" /></template>

