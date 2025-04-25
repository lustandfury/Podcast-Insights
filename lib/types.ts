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
  archived: boolean
  score: number
  month: string
  viewed: boolean // Added viewed property
  hasChat: boolean // Added hasChat property
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

export interface PodcastMention {
  podcast: string
  episode: string
  timestamp: string
}

export interface SampleChat {
  question: string
  response: string
}

export interface InsightTopic {
  id: string
  company: string
  topic: string
  summary: string
  tags: string[]
  mentionedIn: PodcastMention[]
  sampleChat: SampleChat
}
