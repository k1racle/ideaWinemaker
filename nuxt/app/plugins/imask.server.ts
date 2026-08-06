// Keep the phone-mask directive resolvable during SSR. The actual mask is
// attached by the client plugin after hydration.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('imask', {
    getSSRProps() {
      return {}
    },
  })
})
