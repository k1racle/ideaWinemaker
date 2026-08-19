<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  description?: string
  showHints?: boolean
}>(), {
  description: '',
  showHints: true,
})
</script>

<template>
  <div :class="showHints ? 'relative rounded-lg outline outline-1 outline-dashed outline-primary/45' : ''">
    <div
      v-if="showHints"
      class="pointer-events-none absolute left-2 top-0 z-[3] max-w-[calc(100%-1rem)] -translate-y-1/2 rounded-full bg-primary px-2.5 py-1 text-[9px] font-medium uppercase leading-none tracking-[0.1em] text-canvas shadow-sm"
    >
      {{ label }}
    </div>
    <slot />
    <p v-if="showHints && description" class="border-t border-dashed border-primary/25 bg-primary/[0.04] px-3 py-2 text-[11px] leading-relaxed text-ink/60">
      {{ description }}
    </p>
  </div>
</template>
