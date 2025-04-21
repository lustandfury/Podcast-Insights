"use client"

import type React from "react"

import { useState } from "react"
import {
  BookmarkIcon,
  Play,
  Pause,
  Share2,
  Clock,
  PlayCircle,
  BookmarkPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/audio-player"
import type { Insight } from "@/lib/types"

interface InsightCardProps {
  insight: Insight
  onSave: () => void
  onSelect: (insight: Insight) => void
}

// Mock data for multiple podcast sources
interface PodcastSource {
  id: string
  podcastName: string
  episodeNumber: number
  startTime: number
  endTime: number
  audioUrl: string
  fullEpisodeUrl: string
}

export function InsightCard({ insight, onSave, onSelect }: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [showAllSources, setShowAllSources] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  // Mock multiple podcast sources for this insight
  const podcastSources: PodcastSource[] = [
    {
      id: "source1",
      podcastName: insight.podcastName,
      episodeNumber: insight.episodeNumber,
      startTime: insight.startTime,
      endTime: insight.endTime,
      audioUrl: insight.audioUrl,
      fullEpisodeUrl: insight.fullEpisodeUrl,
    },
    {
      id: "source2",
      podcastName: "The Financial Analyst",
      episodeNumber: 78,
      startTime: 845,
      endTime: 920,
      audioUrl: insight.audioUrl, // Using same audio for demo
      fullEpisodeUrl: insight.fullEpisodeUrl,
    },
    {
      id: "source3",
      podcastName: "Market Trends Weekly",
      episodeNumber: 42,
      startTime: 1120,
      endTime: 1190,
      audioUrl: insight.audioUrl, // Using same audio for demo
      fullEpisodeUrl: insight.fullEpisodeUrl,
    },
  ]

  const togglePlay = (sourceId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card selection when clicking play button

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

  // Get the active podcast source
  const getActiveSource = () => {
    return podcastSources.find((source) => source.id === activeSource) || podcastSources[0]
  }

  // Display all sources by default
  const displaySources = podcastSources

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card selection when clicking buttons
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(insight)}
    >
      <CardContent className="p-0">
        <div className="p-4 pb-0">
          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {insight.category}
                </Badge>
              </div>
              <h2 className="text-xl font-bold mt-1">{insight.title}</h2>
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{insight.summary}</p>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 text-sm text-gray-700">
              <p className="mb-2">{insight.fullText}</p>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>Published: {insight.publishDate}</span>
              </div>
            </div>
          )}
        </div>

        {isPlaying && (
          <AudioPlayer
            audioUrl={getActiveSource().audioUrl}
            startTime={getActiveSource().startTime}
            endTime={getActiveSource().endTime}
            onClose={() => {
              setIsPlaying(false)
              setActiveSource(null)
            }}
          />
        )}
      </CardContent>

      <CardFooter className="flex flex-col p-4 pt-2 border-t mt-4">
        <div className="w-full">
          {displaySources.map((source) => (
            <div key={source.id} className="flex items-center justify-between py-1 border-b last:border-b-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-8 gap-1 ${activeSource === source.id && isPlaying ? "bg-gray-100" : ""}`}
                  onClick={(e) => togglePlay(source.id, e)}
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

                <span className="text-sm text-gray-500 font-medium">
                  {source.podcastName} • Ep. {source.episodeNumber}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(source.fullEpisodeUrl, "_blank")
                }}
              >
                <PlayCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {podcastSources.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 w-full text-xs text-gray-500"
              onClick={(e) => {
                e.stopPropagation()
                setShowAllSources(!showAllSources)
              }}
            >
              {showAllSources ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" /> Show fewer sources
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" /> Show all {podcastSources.length} sources
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-2 w-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onSave()
            }}
          >
            {insight.saved ? <BookmarkIcon className="h-4 w-4 fill-current" /> : <BookmarkPlus className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleButtonClick}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
