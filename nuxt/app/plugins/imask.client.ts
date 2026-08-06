import IMask from 'imask'

const inputMasks = new WeakMap<HTMLInputElement, ReturnType<typeof IMask>>()

// v-imask directive, e.g. <input v-imask="{ mask: '+7 (000) 000-00-00' }">
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('imask', {
    mounted(el: HTMLInputElement, binding) {
      inputMasks.set(el, IMask(el, binding.value))
    },
    unmounted(el: HTMLInputElement) {
      inputMasks.get(el)?.destroy()
      inputMasks.delete(el)
    },
  })
})
