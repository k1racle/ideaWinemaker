<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  level?: 1 | 2 | 3
  centered?: boolean
}>(), {
  level: 2,
  centered: false,
})
</script>

<template>
  <div class="mb-7 flex items-center gap-3.5" :class="{ 'justify-center text-center': centered }">
    <span v-if="!centered" class="h-px flex-1 bg-oak/45" />
    <component
      :is="`h${level}`"
      class="m-0 font-serif text-[28px] font-normal uppercase leading-[1.05] tracking-[0.16em] text-black max-[600px]:text-[23px] max-[600px]:tracking-[0.1em]"
      :class="{ 'w-full': centered }"
    >{{ title }}</component>
    <span v-if="!centered" class="h-px flex-1 bg-oak/45" />
  </div>
</template>

