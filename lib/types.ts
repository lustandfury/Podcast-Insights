export interface Insight {
  id: string
  podcastName: string
  podcastImage: string
  episodeNumber: number
  publishDate: string
  title: string
  summary: string
  fullText: string
  category: string
  startTime: number
  endTime: number
  audioUrl: string
  fullEpisodeUrl: string
  saved: boolean
  companies?: string[]
  sectors?: string[]
  keywords?: string[]
}

export interface CustomTab {
  id: string
  name: string
  filters: {
    companies: string[]
    sectors: string[]
    keywords: string[]
  }
}
