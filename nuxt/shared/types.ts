export interface WineFilters {
  year: string
  terroir: string
  winemaker: string
  method: string
}

export const emptyWineFilters = (): WineFilters => ({
  year: '',
  terroir: '',
  winemaker: '',
  method: '',
})

