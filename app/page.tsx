"use client"

import { useState } from "react"
import { PodcastFeed } from "@/components/podcast-feed"
import { Header } from "@/components/header"
import type { Insight } from "@/lib/types"

export default function Home() {
  const [activeInsight, setActiveInsight] = useState<Insight | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeInsight={activeInsight}
        onBack={() => setActiveInsight(null)}
        onSave={() => {
          if (activeInsight) {
            setActiveInsight({
              ...activeInsight,
              saved: !activeInsight.saved,
            })
          }
        }}
      />
      <main className="container mx-auto">
        <PodcastFeed activeInsight={activeInsight} onInsightSelect={setActiveInsight} />
      </main>
    </div>
  )
}
