import { PodcastFeed } from "@/components/podcast-feed"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto">
        <PodcastFeed />
      </main>
    </div>
  )
}
