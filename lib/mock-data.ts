import type { Insight } from "./types"
import { realInsights } from "./real-data"

// Helper function to generate a score between 1-10 based on company and topic
const generateScore = (company: string, topic: string): number => {
  // This is a simplified scoring algorithm for demonstration
  // In a real application, this would be based on more sophisticated analysis

  // Base score between 6-9
  let score = 6 + Math.floor(Math.random() * 4)

  // Adjust score based on company (just for demonstration)
  if (company === "NVIDIA" || company === "Microsoft") score += 1
  if (company === "Apple") score += 0.5

  // Adjust score based on keywords in the topic
  const highImpactKeywords = ["AI", "Earnings", "Growth", "Launch", "Expands", "Dominates"]
  for (const keyword of highImpactKeywords) {
    if (topic.includes(keyword)) score += 0.5
  }

  // Cap at 10
  return Math.min(Math.round(score * 10) / 10, 10)
}

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

  // Generate a score for this insight
  const score = generateScore(topic.company, topic.topic)

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
    archived: false,
    score,
    companies: [topic.company],
    sectors: topic.tags.slice(1, 3),
    keywords: topic.tags.slice(3),
  }
})
