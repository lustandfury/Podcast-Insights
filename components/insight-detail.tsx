"use client"

import { useState, useRef } from "react"
import { Play, Pause, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/audio-player"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatSidebar } from "@/components/chat-sidebar"
import type { Insight } from "@/lib/types"
import { realInsights } from "@/lib/real-data"

// Add imports for the transition
import { motion } from "framer-motion"

interface PodcastSource {
  id: string
  podcastName: string
  episodeNumber: number
  startTime: number
  endTime: number
  audioUrl: string
  fullEpisodeUrl: string
}

interface InsightDetailProps {
  insight: Insight
  onBack: () => void
  onSave: () => void
  onChatCreated?: (insightId: string, chatId: string) => void
}

export function InsightDetail({ insight, onBack, onSave, onChatCreated }: InsightDetailProps) {
  const [activeTab, setActiveTab] = useState("analysis")
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Find the corresponding real insight data
  const realInsight = realInsights.find((ri) => ri.id === insight.id)

  // Create podcast sources from the real data
  const podcastSources: PodcastSource[] = realInsight
    ? realInsight.mentionedIn.map((mention, index) => {
        // Parse the timestamp to get start and end times
        const timestampParts = mention.timestamp.split(" – ")
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
          id: `source-${index}`,
          podcastName: mention.podcast,
          episodeNumber: Number.parseInt(mention.episode),
          startTime,
          endTime,
          audioUrl:
            "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
          fullEpisodeUrl: "https://example.com/episode",
        }
      })
    : []

  const togglePlay = (sourceId: string) => {
    if (activeSource === sourceId && isPlaying) {
      setIsPlaying(false)
      setActiveSource(null)
    } else {
      setIsPlaying(true)
      setActiveSource(sourceId)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Extract key points from the summary
  const generateKeyPoints = (summary: string): string[] => {
    // Split by periods and filter out empty strings
    const sentences = summary.split(".").filter((s) => s.trim().length > 0)

    // Return up to 4 sentences as key points
    return sentences.slice(0, 4).map((s) => s.trim() + ".")
  }

  const keyPoints = realInsight ? generateKeyPoints(realInsight.summary) : []

  const handleChatCreated = (chatId: string) => {
    if (onChatCreated) {
      onChatCreated(insight.id, chatId)
    }
  }

  return (
    <motion.div
      className="flex h-[calc(100vh-4rem)] bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Chat section (60% width) */}
      <div className="w-[60%] border-r">
        <div className="h-full">
          <ChatSidebar insightId={insight.id} insightTitle={insight.title} onChatCreated={handleChatCreated} />
        </div>
      </div>

      {/* Insight details section (40% width) */}
      <div className="w-[40%] flex flex-col overflow-hidden">
        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-white z-10">
            <TabsList className="w-full justify-start px-4">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analysis" className="flex-1 overflow-auto p-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <p className="text-gray-700 mb-6">{insight.summary}</p>

              <h2 className="text-lg font-semibold mb-4">Key Points</h2>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                {keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-700">
                    {point}
                  </li>
                ))}
              </ul>

              <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {realInsight?.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="flex-1 p-4 overflow-auto">
            <div>
              <h2 className="text-lg font-semibold mb-4">Podcast Sources</h2>
              <div className="space-y-4">
                {podcastSources.map((source) => (
                  <Card key={source.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{source.podcastName}</h3>
                        <p className="text-sm text-gray-500">Episode {source.episodeNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`gap-1 ${activeSource === source.id && isPlaying ? "bg-gray-100" : ""}`}
                          onClick={() => togglePlay(source.id)}
                        >
                          {activeSource === source.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          <span>
                            {formatTime(source.startTime)} - {formatTime(source.endTime)}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(source.fullEpisodeUrl, "_blank")}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {activeSource === source.id && isPlaying && (
                      <div className="mt-4">
                        <AudioPlayer
                          audioUrl={source.audioUrl}
                          startTime={source.startTime}
                          endTime={source.endTime}
                          onClose={() => {
                            setIsPlaying(false)
                            setActiveSource(null)
                          }}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
