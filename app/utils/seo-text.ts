const normalizeSeoText = (value: string) => value.replace(/\s+/g, ' ').trim()

const truncateAtWord = (value: string, maxLength: number) => {
  const normalized = normalizeSeoText(value)
  if (normalized.length <= maxLength) return normalized

  const slice = normalized.slice(0, maxLength - 1)
  const wordBoundary = slice.lastIndexOf(' ')
  const shortened = wordBoundary >= Math.floor(maxLength * 0.65)
    ? slice.slice(0, wordBoundary)
    : slice

  return `${shortened.replace(/[\s,.;:!?—-]+$/u, '')}…`
}

// The site name is appended globally by Nuxt SEO, so page titles stay compact.
export const toSeoTitle = (value: string) => truncateAtWord(value, 44)

export const toSeoDescription = (value: string) => truncateAtWord(value, 160)

export const useCanonicalUrl = (path: string) => new URL(path, useSiteConfig().url).toString()
