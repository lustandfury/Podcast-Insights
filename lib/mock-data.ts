import type { Insight } from "./types"
import { realInsights } from "./real-data"

// Convert real insights to the format expected by the app
export const mockInsights: Insight[] = realInsights.map((topic, index) => {
  // Get the first podcast mention for basic data
  const firstMention = topic.mentionedIn[0]

  // Parse the timestamp to get start and end times
  const timestampParts = firstMention.timestamp.split(" – ")
  const startTimePart = timestampParts[0].replace("00:", "")
  const endTimePart = timestampParts[1].replace("00:", "")

  // Convert timestamp to seconds
  const convertTimeToSeconds = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(":").map(Number)
    return minutes * 60 + seconds
  }

  const startTime = convertTimeToSeconds(startTimePart)
  const endTime = convertTimeToSeconds(endTimePart)

  return {
    id: topic.id,
    podcastName: firstMention.podcast,
    podcastImage: "/placeholder.svg?height=100&width=100",
    episodeNumber: Number.parseInt(firstMention.episode),
    publishDate: "Apr 2025",
    title: topic.topic,
    summary: topic.summary,
    fullText: topic.summary,
    category: topic.company,
    startTime,
    endTime,
    audioUrl:
      "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    fullEpisodeUrl: "https://example.com/episode",
    saved: false,
    companies: [topic.company],
    sectors: topic.tags.slice(1, 3),
    keywords: topic.tags.slice(3),
  }
})
