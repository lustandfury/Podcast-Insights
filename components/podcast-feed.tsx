"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { InsightCard } from "@/components/insight-card"
import { InsightDetail } from "@/components/insight-detail"
import { mockInsights } from "@/lib/mock-data"
import { Sidebar } from "@/components/sidebar"
import type { TabFilter } from "@/components/create-tab-modal"
import type { CustomTab, Insight } from "@/lib/types"
import { ArrowDownAZ, ArrowUpAZ, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentChat {
  id: string
  insightId: string
  insightTitle: string
  lastUpdated: Date
  hasUserMessage: boolean
}

interface UnreadCounts {
  [key: string]: number
}

interface PodcastFeedProps {
  activeInsight: Insight | null
  onInsightSelect: (insight: Insight | null) => void
}

type SortOption = "score" | "alphabetical" | "alphabeticalReverse"

export function PodcastFeed({ activeInsight, onInsightSelect }: PodcastFeedProps) {
  const [insights, setInsights] = useState(mockInsights)
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [recentChats, setRecentChats] = useState<RecentChat[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("score")

  // Mock unread counts for demonstration
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({
    all: 12,
    saved: 3,
    Salesforce: 2,
    NVIDIA: 5,
    Google: 1,
    Microsoft: 3,
    Apple: 1,
  })

  const saveInsight = (insightId: string) => {
    setInsights(insights.map((insight) => (insight.id === insightId ? { ...insight, saved: !insight.saved } : insight)))

    // If we're in the detail view, update the selected insight too
    if (activeInsight && activeInsight.id === insightId) {
      onInsightSelect({
        ...activeInsight,
        saved: !activeInsight.saved,
      })
    }
  }

  const archiveInsight = (insightId: string) => {
    setInsights(insights.map((insight) => (insight.id === insightId ? { ...insight, archived: true } : insight)))

    // If we're in the detail view and archiving the current insight, go back to the feed
    if (activeInsight && activeInsight.id === insightId) {
      onInsightSelect(null)
    }

    // Reduce unread count for the category
    const insight = insights.find((i) => i.id === insightId)
    if (insight && unreadCounts[insight.category] > 0) {
      setUnreadCounts((prev) => ({
        ...prev,
        [insight.category]: prev[insight.category] - 1,
        all: prev.all > 0 ? prev.all - 1 : 0,
      }))
    }
  }

  const handleCreateTab = (name: string, filters: TabFilter) => {
    const newTab: CustomTab = {
      id: `custom-${Date.now()}`,
      name,
      filters,
    }

    setCustomTabs([...customTabs, newTab])
    setActiveTab(newTab.id) // Switch to the new tab

    // Add unread count for the new tab
    setUnreadCounts((prev) => ({
      ...prev,
      [newTab.id]: 0,
    }))
  }

  const filterInsightsByCustomTab = (insight: Insight, tab: CustomTab): boolean => {
    // Company filter (required)
    const hasMatchingCompany = insight.companies?.some((company) => tab.filters.companies.includes(company))

    if (!hasMatchingCompany) return false

    // Sector filter (if specified)
    if (tab.filters.sectors.length > 0) {
      const hasMatchingSector = insight.sectors?.some((sector) => tab.filters.sectors.includes(sector))

      if (!hasMatchingSector) return false
    }

    // Keyword filter (if specified)
    if (tab.filters.keywords.length > 0) {
      const hasMatchingKeyword = insight.keywords?.some((keyword) => tab.filters.keywords.includes(keyword))

      if (!hasMatchingKeyword) return false
    }

    return true
  }

  const getFilteredInsights = () => {
    let filteredInsights: Insight[] = []

    switch (activeTab) {
      case "all":
        filteredInsights = insights
        break
      case "saved":
        filteredInsights = insights.filter((i) => i.saved)
        break
      case "Salesforce":
      case "NVIDIA":
      case "Google":
      case "Microsoft":
      case "Apple":
        filteredInsights = insights.filter((i) => i.category === activeTab)
        break
      default:
        // Handle custom tabs
        const customTab = customTabs.find((tab) => tab.id === activeTab)
        if (customTab) {
          filteredInsights = insights.filter((insight) => filterInsightsByCustomTab(insight, customTab))
        } else {
          filteredInsights = insights
        }
    }

    // Filter by archived status
    filteredInsights = filteredInsights.filter((insight) => insight.archived === showArchived)

    // Sort insights based on the selected sort option  => insight.archived === showArchived)

    // Sort insights based on the selected sort option
    switch (sortOption) {
      case "score":
        filteredInsights.sort((a, b) => b.score - a.score)
        break
      case "alphabetical":
        filteredInsights.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "alphabeticalReverse":
        filteredInsights.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return filteredInsights
  }

  // Handle selecting an insight with transition
  const handleSelectInsight = (insight: Insight) => {
    setIsTransitioning(true)
    // Short delay to allow animation to start
    setTimeout(() => {
      onInsightSelect(insight)
      setIsTransitioning(false)

      // When selecting an insight, reduce the unread count for its category
      if (unreadCounts[insight.category] > 0) {
        setUnreadCounts((prev) => ({
          ...prev,
          [insight.category]: prev[insight.category] - 1,
          all: prev.all > 0 ? prev.all - 1 : 0,
        }))
      }
    }, 300)
  }

  // Handle chat creation
  const handleChatCreated = (insightId: string, chatId: string, hasUserMessage: boolean) => {
    const insight = insights.find((i) => i.id === insightId)
    if (!insight) return

    // Check if we already have a chat for this insight
    const existingChatIndex = recentChats.findIndex((chat) => chat.insightId === insightId)

    if (existingChatIndex !== -1) {
      // Update existing chat
      const updatedChats = [...recentChats]
      updatedChats[existingChatIndex] = {
        ...updatedChats[existingChatIndex],
        id: chatId,
        lastUpdated: new Date(),
        hasUserMessage,
      }
      setRecentChats(updatedChats)
    } else {
      // Add new chat
      const newChat: RecentChat = {
        id: chatId,
        insightId,
        insightTitle: insight.title,
        lastUpdated: new Date(),
        hasUserMessage,
      }
      setRecentChats([newChat, ...recentChats])
    }
  }

  // Handle selecting a chat from the sidebar
  const handleChatSelect = (insightId: string) => {
    const insight = insights.find((i) => i.id === insightId)
    if (insight) {
      handleSelectInsight(insight)
    }
  }

  // Toggle between active and archived views
  const handleToggleArchiveView = (tabId: string) => {
    setShowArchived(!showArchived)
  }

  // If an insight is selected, show the detail view
  if (activeInsight) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <InsightDetail
          insight={activeInsight}
          onBack={() => onInsightSelect(null)}
          onSave={() => saveInsight(activeInsight.id)}
          onArchive={() => archiveInsight(activeInsight.id)}
          onChatCreated={(insightId, chatId, hasUserMessage) => handleChatCreated(insightId, chatId, hasUserMessage)}
        />
      </motion.div>
    )
  }

  // Otherwise show the feed
  return (
    <div className="flex">
      <Sidebar
        activeTab={activeTab}
        customTabs={customTabs}
        recentChats={recentChats}
        unreadCounts={unreadCounts}
        showArchived={showArchived}
        onTabChange={setActiveTab}
        onCreateTab={handleCreateTab}
        onChatSelect={handleChatSelect}
        onToggleArchiveView={handleToggleArchiveView}
      />

      <motion.div
        className="flex-1 p-4"
        initial={{ opacity: isTransitioning ? 1 : 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Active tab header */}
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-xl font-semibold">
            {activeTab === "all"
              ? `${showArchived ? "Archived" : "All"} Insights`
              : activeTab === "saved"
                ? `${showArchived ? "Archived" : ""} Saved`
                : `${showArchived ? "Archived" : ""} ${customTabs.find((tab) => tab.id === activeTab)?.name || activeTab}`}
          </h2>

          <div className="flex items-center gap-2">
            {/* Sort options */}
            <div className="flex items-center gap-1">
              <Button
                variant={sortOption === "score" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortOption("score")}
                title="Sort by Impact Score"
                className="h-8"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Impact</span>
              </Button>
              <Button
                variant={sortOption === "alphabetical" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortOption("alphabetical")}
                title="Sort A-Z"
                className="h-8"
              >
                <ArrowDownAZ className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">A-Z</span>
              </Button>
              <Button
                variant={sortOption === "alphabeticalReverse" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortOption("alphabeticalReverse")}
                title="Sort Z-A"
                className="h-8"
              >
                <ArrowUpAZ className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Z-A</span>
              </Button>
            </div>

            {/* Show filter info for custom tabs */}
            {customTabs.find((tab) => tab.id === activeTab) && (
              <div className="text-sm text-muted-foreground ml-4">
                {customTabs.find((tab) => tab.id === activeTab)?.filters.companies.length} companies,{" "}
                {customTabs.find((tab) => tab.id === activeTab)?.filters.sectors.length} sectors,{" "}
                {customTabs.find((tab) => tab.id === activeTab)?.filters.keywords.length} keywords
              </div>
            )}
          </div>
        </div>

        {/* Insights list */}
        <div className="space-y-4 mt-4">
          {getFilteredInsights().map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onSave={() => saveInsight(insight.id)}
              onArchive={() => archiveInsight(insight.id)}
              onSelect={handleSelectInsight}
            />
          ))}

          {getFilteredInsights().length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {showArchived ? "No archived insights found for this filter." : "No insights found for this filter."}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
