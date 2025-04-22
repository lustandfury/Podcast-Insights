"use client"

import Link from "next/link"
import { Search, ArrowLeft, BookmarkIcon, BookmarkPlus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Insight } from "@/lib/types"

interface HeaderProps {
  activeInsight?: Insight | null
  onBack?: () => void
  onSave?: () => void
}

export function Header({ activeInsight, onBack, onSave }: HeaderProps) {
  // If we have an active insight, show the insight details header
  if (activeInsight) {
    return (
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>

          <h1 className="font-bold text-lg truncate flex-1">{activeInsight.title}</h1>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onSave}>
              {activeInsight.saved ? (
                <BookmarkIcon className="h-5 w-5 fill-current" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
              <span className="sr-only">{activeInsight.saved ? "Unsave" : "Save"}</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </header>
    )
  }

  // Default header
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          PodcastInsights
        </Link>

        <div className="hidden md:flex items-center w-1/3 relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Search insights..." className="pl-10 w-full" />
        </div>
      </div>
    </header>
  )
}
