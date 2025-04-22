"use client"

import { useState } from "react"
import { PodcastFeed } from "@/components/podcast-feed"
import type { Insight } from "@/lib/types"

export default function Home() {
  const [activeInsight, setActiveInsight] = useState<Insight | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto">
        <PodcastFeed activeInsight={activeInsight} onInsightSelect={setActiveInsight} />
      </main>
    </div>
  )
}
