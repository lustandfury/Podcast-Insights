"use client"

import type React from "react"

import { useState } from "react"
import { BookmarkIcon, BookmarkPlus, Share2, MessageSquare, ChevronRight, Play, Pause, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/audio-player"
import type { Insight } from "@/lib/types"
import { realInsights } from "@/lib/real-data"

interface InsightCardProps {
  insight: Insight
  onSave: () => void
  onArchive: () => void
  onSelect: (insight: Insight) => void
}

export function InsightCard({ insight, onSave, onArchive, onSelect }: InsightCardProps) {
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card selection when clicking buttons
  }

  // Get the real insight data to access podcast sources
  const realInsight = realInsights.find((ri) => ri.id === insight.id)
  const podcastSources = realInsight?.mentionedIn || []

  // Convert timestamp to seconds
  const convertTimeToSeconds = (timeStr: string) => {
    const cleanTimeStr = timeStr.replace("00:", "")
    const [minutes, seconds] = cleanTimeStr.split(":").map(Number)
    return minutes * 60 + seconds
  }

  const togglePlay = (sourceIndex: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card selection when clicking play button

    const sourceId = `source-${sourceIndex}`

    if (activeSource === sourceId && isPlaying) {
      setIsPlaying(false)
      setActiveSource(null)
    } else {
      setIsPlaying(true)
      setActiveSource(sourceId)
    }
  }

  // Get the active podcast source
  const getActiveSource = () => {
    if (!activeSource) return null

    const index = Number.parseInt(activeSource.split("-")[1])
    const source = podcastSources[index]

    if (!source) return null

    // Parse the timestamp to get start and end times
    const timestampParts = source.timestamp.split(" – ")
    const startTimePart = timestampParts[0].replace("00:", "")
    const endTimePart = timestampParts[1].replace("00:", "")

    return {
      id: activeSource,
      podcastName: source.podcast,
      episodeNumber: Number.parseInt(source.episode),
      startTime: convertTimeToSeconds(startTimePart),
      endTime: convertTimeToSeconds(endTimePart),
      audioUrl:
        "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
      fullEpisodeUrl: "https://example.com/episode",
    }
  }

  // Function to determine score color
  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-red-100 text-red-600"
    if (score >= 7) return "bg-orange-100 text-orange-600"
    if (score >= 5) return "bg-yellow-100 text-yellow-600"
    return "bg-gray-400 text-white"
  }

  // Function to get score description
  const getScoreDescription = (score: number) => {
    if (score >= 9) return "High Impact"
    if (score >= 7) return "Medium Impact"
    if (score >= 5) return "Low Impact"
    return "Low Impact"
  }

  const activeSourceData = getActiveSource()

  return (
    <Card
      className={`overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 ${
        insight.viewed ? "border-l-gray-300" : "border-l-transparent hover:border-l-primary"
      } relative group`}
      onClick={() => onSelect(insight)}
    >
      {/* Chat button - more prominent */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant={insight.hasChat ? "secondary" : "outline"}
          size="sm"
          className="gap-1 px-3 py-1 h-8"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(insight)
          }}
        >
          <MessageSquare className={`h-4 w-4 ${insight.hasChat ? "fill-primary" : ""}`} />
          <span>{insight.hasChat ? "Continue Chat" : "Chat"}</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {/* New/Read indicator aligned with other elements */}
              <Badge className={insight.viewed ? "bg-gray-200 text-gray-700" : "bg-primary text-white"}>
                {insight.viewed ? "Read" : "New"}
              </Badge>

              <Badge variant="outline" className="text-xs">
                {insight.category}
              </Badge>

              {/* Impact Score with description */}
              <div className={`rounded-full px-2 py-0.5 text-xs font-bold ${getScoreColor(insight.score)}`}>
                {insight.score.toFixed(1)} - {getScoreDescription(insight.score)}
              </div>
            </div>

            <h2 className="text-2xl font-playfair font-bold mt-3">{insight.title}</h2>
            <p className="text-lg text-gray-700 mt-2">{insight.summary}</p>

            {/* Compact podcast sources with play buttons */}
            {podcastSources.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {podcastSources.map((source, index) => (
                  <div
                    key={index}
                    className={`flex items-center rounded-full px-2 py-1 text-xs cursor-pointer transition-colors ${
                      activeSource === `source-${index}` && isPlaying
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={(e) => togglePlay(index, e)}
                  >
                    {activeSource === `source-${index}` && isPlaying ? (
                      <Pause className="h-3 w-3 mr-1" />
                    ) : (
                      <Play className="h-3 w-3 mr-1" />
                    )}
                    <span className="font-medium">{source.podcast}</span>
                    <span className="mx-1">•</span>
                    <span>Ep. {source.episode}</span>
                    <span className="mx-1">•</span>
                    <span>{source.timestamp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Audio player for active source */}
            {isPlaying && activeSourceData && (
              <div className="mt-3">
                <AudioPlayer
                  audioUrl={activeSourceData.audioUrl}
                  startTime={activeSourceData.startTime}
                  endTime={activeSourceData.endTime}
                  onClose={() => {
                    setIsPlaying(false)
                    setActiveSource(null)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2 p-4 pt-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            onArchive()
          }}
          title="Archive"
        >
          <Archive className="h-8 w-8" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
          title={insight.saved ? "Unsave" : "Save"}
        >
          {insight.saved ? <BookmarkIcon className="h-8 w-8 fill-current" /> : <BookmarkPlus className="h-8 w-8" />}
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleButtonClick} title="Share">
          <Share2 className="h-8 w-8" />
        </Button>
      </CardFooter>
    </Card>
  )
}
