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
  const [showArchived, setShowArchived] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("score")

  // Calculate unread counts based on insights that haven't been viewed
  const calculateUnreadCounts = () => {
    const counts: UnreadCounts = {
      all: 0,
      saved: 0,
      Salesforce: 0,
      NVIDIA: 0,
      Google: 0,
      Microsoft: 0,
      Apple: 0,
    }

    // Add custom tab IDs to the counts object
    customTabs.forEach((tab) => {
      counts[tab.id] = 0
    })

    // Only count unarchived and unviewed insights
    insights
      .filter((i) => !i.archived && !i.viewed)
      .forEach((insight) => {
        // Increment the count for the category
        if (counts[insight.category] !== undefined) {
          counts[insight.category]++
        }

        // Increment the count for "all"
        counts.all++

        // Increment the count for "saved" if the insight is saved
        if (insight.saved) {
          counts.saved++
        }

        // Increment the count for custom tabs if the insight matches the filters
        customTabs.forEach((tab) => {
          if (filterInsightsByCustomTab(insight, tab)) {
            counts[tab.id]++
          }
        })
      })

    return counts
  }

  // Calculate unread counts
  const unreadCounts = calculateUnreadCounts()

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
  }

  const handleCreateTab = (name: string, filters: TabFilter) => {
    const newTab: CustomTab = {
      id: `custom-${Date.now()}`,
      name,
      filters,
    }

    setCustomTabs([...customTabs, newTab])
    setActiveTab(newTab.id) // Switch to the new tab
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

  // Group insights by month
  const groupInsightsByMonth = () => {
    const filteredInsights = getFilteredInsights()
    const groupedInsights: { [month: string]: Insight[] } = {}

    // Define the order of months
    const monthOrder = ["April", "March", "February"]

    // Initialize groups for each month
    monthOrder.forEach((month) => {
      groupedInsights[month] = []
    })

    // Group insights by month
    filteredInsights.forEach((insight) => {
      if (groupedInsights[insight.month]) {
        groupedInsights[insight.month].push(insight)
      }
    })

    return { groupedInsights, monthOrder }
  }

  // Handle selecting an insight with transition
  const handleSelectInsight = (insight: Insight) => {
    setIsTransitioning(true)

    // Mark the insight as viewed if it's not already
    if (!insight.viewed) {
      setInsights(insights.map((i) => (i.id === insight.id ? { ...i, viewed: true } : i)))
    }

    // Short delay to allow animation to start
    setTimeout(() => {
      onInsightSelect({
        ...insight,
        viewed: true,
      })
      setIsTransitioning(false)
    }, 300)
  }

  // Handle chat creation
  const handleChatCreated = (insightId: string) => {
    // Mark the insight as having a chat
    setInsights(insights.map((insight) => (insight.id === insightId ? { ...insight, hasChat: true } : insight)))

    // If we're in the detail view, update the selected insight too
    if (activeInsight && activeInsight.id === insightId) {
      onInsightSelect({
        ...activeInsight,
        hasChat: true,
      })
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
          onChatCreated={() => handleChatCreated(activeInsight.id)}
        />
      </motion.div>
    )
  }

  // Get grouped insights
  const { groupedInsights, monthOrder } = groupInsightsByMonth()

  // Otherwise show the feed
  return (
    <div className="flex">
      <Sidebar
        activeTab={activeTab}
        customTabs={customTabs}
        unreadCounts={unreadCounts}
        showArchived={showArchived}
        onTabChange={setActiveTab}
        onCreateTab={handleCreateTab}
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

        {/* Insights list grouped by month */}
        <div className="mt-4">
          {monthOrder.map((month) => {
            const monthInsights = groupedInsights[month]

            // Only show months that have insights
            if (monthInsights.length === 0) return null

            return (
              <div key={month} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-50 py-2 z-10 border-b">{month} 2025</h3>
                <div className="space-y-4">
                  {monthInsights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onSave={() => saveInsight(insight.id)}
                      onArchive={() => archiveInsight(insight.id)}
                      onSelect={handleSelectInsight}
                    />
                  ))}
                </div>
              </div>
            )
          })}

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
