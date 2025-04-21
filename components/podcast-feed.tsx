"use client"

import { useState } from "react"
import { InsightCard } from "@/components/insight-card"
import { InsightDetail } from "@/components/insight-detail"
import { mockInsights } from "@/lib/mock-data"
import { Sidebar } from "@/components/sidebar"
import type { TabFilter } from "@/components/create-tab-modal"
import type { CustomTab, Insight } from "@/lib/types"

export function PodcastFeed() {
  const [insights, setInsights] = useState(mockInsights)
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)

  const saveInsight = (insightId: string) => {
    setInsights(insights.map((insight) => (insight.id === insightId ? { ...insight, saved: !insight.saved } : insight)))

    // If we're in the detail view, update the selected insight too
    if (selectedInsight && selectedInsight.id === insightId) {
      setSelectedInsight({
        ...selectedInsight,
        saved: !selectedInsight.saved,
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
      case "market":
        return insights.filter((i) => i.category === "Market Updates")
      case "strategy":
        return insights.filter((i) => i.category === "Investment Strategy")
      default:
        // Handle custom tabs
        const customTab = customTabs.find((tab) => tab.id === activeTab)
        if (customTab) {
          return insights.filter((insight) => filterInsightsByCustomTab(insight, customTab))
        }
        return insights
    }
  }

  // If an insight is selected, show the detail view
  if (selectedInsight) {
    return (
      <InsightDetail
        insight={selectedInsight}
        onBack={() => setSelectedInsight(null)}
        onSave={() => saveInsight(selectedInsight.id)}
      />
    )
  }

  // Otherwise show the feed
  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} customTabs={customTabs} onTabChange={setActiveTab} onCreateTab={handleCreateTab} />

      <div className="flex-1 p-4">
        {/* Active tab header */}
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-xl font-semibold">
            {activeTab === "all"
              ? "All Insights"
              : activeTab === "saved"
                ? "Saved"
                : activeTab === "market"
                  ? "Market Updates"
                  : activeTab === "strategy"
                    ? "Investment Strategy"
                    : customTabs.find((tab) => tab.id === activeTab)?.name || "Insights"}
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
              onSelect={setSelectedInsight}
            />
          ))}

          {getFilteredInsights().length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No insights found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
