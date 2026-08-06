// Global open/close state for the contact popup (replaces the CF7 + script.js wiring).
export const useContactPopup = () => {
  const isOpen = useState('contact-popup-open', () => false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
