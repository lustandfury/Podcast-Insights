"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { InsightCard } from "@/components/insight-card"
import { InsightDetail } from "@/components/insight-detail"
import { mockInsights } from "@/lib/mock-data"
import { Sidebar } from "@/components/sidebar"
import type { TabFilter } from "@/components/create-tab-modal"
import type { CustomTab, Insight } from "@/lib/types"

interface RecentChat {
  id: string
  insightId: string
  insightTitle: string
  lastUpdated: Date
}

interface PodcastFeedProps {
  activeInsight: Insight | null
  onInsightSelect: (insight: Insight | null) => void
}

export function PodcastFeed({ activeInsight, onInsightSelect }: PodcastFeedProps) {
  const [insights, setInsights] = useState(mockInsights)
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [recentChats, setRecentChats] = useState<RecentChat[]>([])

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
    switch (activeTab) {
      case "all":
        return insights
      case "saved":
        return insights.filter((i) => i.saved)
      case "Salesforce":
      case "NVIDIA":
      case "Google":
      case "Microsoft":
      case "Apple":
        return insights.filter((i) => i.category === activeTab)
      default:
        // Handle custom tabs
        const customTab = customTabs.find((tab) => tab.id === activeTab)
        if (customTab) {
          return insights.filter((insight) => filterInsightsByCustomTab(insight, customTab))
        }
        return insights
    }
  }

  // Handle selecting an insight with transition
  const handleSelectInsight = (insight: Insight) => {
    setIsTransitioning(true)
    // Short delay to allow animation to start
    setTimeout(() => {
      onInsightSelect(insight)
      setIsTransitioning(false)
    }, 300)
  }

  // Handle chat creation
  const handleChatCreated = (insightId: string, chatId: string) => {
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
      }
      setRecentChats(updatedChats)
    } else {
      // Add new chat
      const newChat: RecentChat = {
        id: chatId,
        insightId,
        insightTitle: insight.title,
        lastUpdated: new Date(),
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

  // If an insight is selected, show the detail view
  if (activeInsight) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <InsightDetail
          insight={activeInsight}
          onBack={() => onInsightSelect(null)}
          onSave={() => saveInsight(activeInsight.id)}
          onChatCreated={handleChatCreated}
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
        onTabChange={setActiveTab}
        onCreateTab={handleCreateTab}
        onChatSelect={handleChatSelect}
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
              ? "All Insights"
              : activeTab === "saved"
                ? "Saved"
                : customTabs.find((tab) => tab.id === activeTab)?.name || activeTab}
          </h2>

          {/* Show filter info for custom tabs */}
          {customTabs.find((tab) => tab.id === activeTab) && (
            <div className="text-sm text-muted-foreground">
              {customTabs.find((tab) => tab.id === activeTab)?.filters.companies.length} companies,{" "}
              {customTabs.find((tab) => tab.id === activeTab)?.filters.sectors.length} sectors,{" "}
              {customTabs.find((tab) => tab.id === activeTab)?.filters.keywords.length} keywords
            </div>
          )}
        </div>

        {/* Insights list */}
        <div className="space-y-4">
          {getFilteredInsights().map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onSave={() => saveInsight(insight.id)}
              onSelect={handleSelectInsight}
            />
          ))}

          {getFilteredInsights().length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No insights found for this filter.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
