import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
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
