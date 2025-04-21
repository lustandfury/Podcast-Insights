"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, BookmarkIcon, BookmarkPlus, Share2, Play, Pause, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AudioPlayer } from "@/components/audio-player"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Insight } from "@/lib/types"

interface PodcastSource {
  id: string
  podcastName: string
  episodeNumber: number
  startTime: number
  endTime: number
  audioUrl: string
  fullEpisodeUrl: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface InsightDetailProps {
  insight: Insight
  onBack: () => void
  onSave: () => void
}

export function InsightDetail({ insight, onBack, onSave }: InsightDetailProps) {
  const [activeTab, setActiveTab] = useState("analysis")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your financial insights assistant. Ask me anything about "${insight.title}" or related financial topics.`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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

  // Mock deeper analysis content
  const deeperAnalysis = {
    summary: insight.fullText,
    keyPoints: [
      "The Federal Reserve's decision signals a shift in inflation management approach",
      "Opportunities in the 10-year Treasury market are emerging with yields potentially stabilizing around 3.8%",
      "Investment-grade corporate bonds may outperform in this environment",
      "Asset managers should consider rebalancing fixed income portfolios",
    ],
    marketImplications: [
      "Bond markets are likely to see reduced volatility in the coming quarter",
      "Yield curve may flatten as short-term rates stabilize",
      "Corporate credit spreads could tighten, particularly in the A-rated segment",
      "International investors may increase allocations to US fixed income",
    ],
    relatedTopics: ["Interest Rates", "Bond Markets", "Federal Reserve", "Inflation", "Fixed Income"],
  }

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle window resize to ensure proper scrolling
  useEffect(() => {
    const handleResize = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  // Get the active podcast source
  const getActiveSource = () => {
    return podcastSources.find((source) => source.id === activeSource) || podcastSources[0]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      // Generate a mock response based on the user's question
      let responseContent = ""
      const userQuestion = inputMessage.toLowerCase()

      if (userQuestion.includes("interest rate") || userQuestion.includes("fed")) {
        responseContent =
          "Based on the podcast insights, the Federal Reserve's decision to maintain rates at current levels signals a shift in their approach to inflation management. This is likely to create stability in the bond markets, with yields on the 10-year Treasury potentially stabilizing around 3.8% by Q3."
      } else if (userQuestion.includes("bond") || userQuestion.includes("treasury")) {
        responseContent =
          "The podcast suggests that investment-grade corporate bonds may outperform in this environment. Asset managers should consider rebalancing fixed income portfolios to capitalize on this trend. The yield curve may flatten as short-term rates stabilize."
      } else if (userQuestion.includes("portfolio") || userQuestion.includes("invest")) {
        responseContent =
          "According to the insights, asset managers should consider rebalancing fixed income portfolios to capitalize on emerging trends. Corporate credit spreads could tighten, particularly in the A-rated segment, and international investors may increase allocations to US fixed income."
      } else {
        responseContent =
          "The podcast insights highlight several key points about the current market environment. Would you like me to elaborate on any specific aspect such as interest rates, bond markets, or portfolio strategies?"
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      {/* Header */}
      <div className="border-b p-4 bg-white z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{insight.title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onSave}>
              {insight.saved ? <BookmarkIcon className="h-5 w-5 fill-current" /> : <BookmarkPlus className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline">{insight.category}</Badge>
          <span className="text-sm text-gray-500">Published: {insight.publishDate}</span>
        </div>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b bg-white z-10">
          <TabsList className="w-full justify-start px-4">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="analysis" className="flex-1 flex flex-col relative">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto pb-24" ref={chatContainerRef}>
            <div className="max-w-3xl mx-auto p-4">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <p className="text-gray-700 mb-6">{deeperAnalysis.summary}</p>

              <h2 className="text-lg font-semibold mb-4">Key Points</h2>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                {deeperAnalysis.keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-700">
                    {point}
                  </li>
                ))}
              </ul>

              <h2 className="text-lg font-semibold mb-4">Market Implications</h2>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                {deeperAnalysis.marketImplications.map((implication, index) => (
                  <li key={index} className="text-gray-700">
                    {implication}
                  </li>
                ))}
              </ul>

              <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {deeperAnalysis.relatedTopics.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Chat section */}
              <div className="mt-8 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Ask about this insight</h2>

                <div className="space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <p>Typing...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed chat input */}
          <div
            className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md z-20"
            style={{ maxWidth: "100%" }}
          >
            <div className="max-w-3xl mx-auto flex gap-2">
              <Textarea
                placeholder="Ask about this insight..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="resize-none min-h-[44px] max-h-[120px]"
                rows={1}
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="flex-1 p-4 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Podcast Sources</h2>
            <div className="space-y-4 pb-24">
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
                      <Button variant="ghost" size="icon" onClick={() => window.open(source.fullEpisodeUrl, "_blank")}>
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
  )
}
