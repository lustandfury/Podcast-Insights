"use client"

import { useState } from "react"
import { Plus, Menu, MessageSquare, Archive, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CreateTabModal, type TabFilter } from "@/components/create-tab-modal"
import type { CustomTab } from "@/lib/types"
import { cn } from "@/lib/utils"

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

interface SidebarProps {
  activeTab: string
  customTabs: CustomTab[]
  recentChats?: RecentChat[]
  unreadCounts?: UnreadCounts
  showArchived: boolean
  onTabChange: (tabId: string) => void
  onCreateTab: (name: string, filters: TabFilter) => void
  onChatSelect?: (insightId: string) => void
  onToggleArchiveView: (tabId: string) => void
}

export function Sidebar({
  activeTab,
  customTabs,
  recentChats = [],
  unreadCounts = {},
  showArchived,
  onTabChange,
  onCreateTab,
  onChatSelect,
  onToggleArchiveView,
}: SidebarProps) {
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false)

  // Default tabs
  const defaultTabs = [
    { id: "all", name: "All Insights" },
    { id: "saved", name: "Saved" },
  ]

  // Company feeds
  const companyFeeds = [
    { id: "Salesforce", name: "Salesforce" },
    { id: "NVIDIA", name: "NVIDIA" },
    { id: "Google", name: "Google" },
    { id: "Microsoft", name: "Microsoft" },
    { id: "Apple", name: "Apple" },
  ]

  const handleChatSelect = (insightId: string) => {
    if (onChatSelect) {
      onChatSelect(insightId)
    }
  }

  // Filter recent chats to only include those with user messages
  const filteredRecentChats = recentChats.filter((chat) => chat.hasUserMessage)

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col px-4 py-3 border-b">
        <h1 className="font-norrmal text-xl text-primary mb-3">Equity IQ</h1>
        <Button variant="outline" size="sm" onClick={() => setIsCreateTabModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Feed
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <div className="space-y-1">
            {defaultTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className={cn("w-full justify-start text-left font-normal", activeTab === tab.id && "font-medium")}
                onClick={() => onTabChange(tab.id)}
              >
                <span className="flex-1">{tab.name}</span>
                {unreadCounts[tab.id] > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCounts[tab.id]}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Company feeds section with title and archive toggle */}
          <div className="mt-6 mb-2 px-2 flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Feeds</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onToggleArchiveView(activeTab)}
              title={showArchived ? "Show Active" : "Show Archived"}
            >
              {showArchived ? <Inbox className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </Button>
          </div>
          <div className="space-y-1">
            {companyFeeds.map((feed) => (
              <div key={feed.id} className="flex items-center">
                <Button
                  variant={activeTab === feed.id ? "secondary" : "ghost"}
                  className={cn("w-full justify-start text-left font-normal", activeTab === feed.id && "font-medium")}
                  onClick={() => onTabChange(feed.id)}
                >
                  <span className="flex-1">{feed.name}</span>
                  {unreadCounts[feed.id] > 0 && !showArchived && (
                    <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5">
                      {unreadCounts[feed.id]}
                    </span>
                  )}
                </Button>
                {activeTab === feed.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-1"
                    onClick={() => onToggleArchiveView(feed.id)}
                    title={showArchived ? "Show Active" : "Show Archived"}
                  >
                    {showArchived ? <Inbox className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {customTabs.length > 0 && (
            <>
              <div className="mt-6 mb-2 px-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Custom Tabs</h4>
                {activeTab.startsWith("custom-") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onToggleArchiveView(activeTab)}
                    title={showArchived ? "Show Active" : "Show Archived"}
                  >
                    {showArchived ? <Inbox className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                {customTabs.map((tab) => (
                  <div key={tab.id} className="flex items-center">
                    <Button
                      variant={activeTab === tab.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        activeTab === tab.id && "font-medium",
                      )}
                      onClick={() => onTabChange(tab.id)}
                    >
                      <span className="flex-1">{tab.name}</span>
                      {unreadCounts[tab.id] > 0 && !showArchived && (
                        <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5">
                          {unreadCounts[tab.id]}
                        </span>
                      )}
                    </Button>
                    {activeTab === tab.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-1"
                        onClick={() => onToggleArchiveView(tab.id)}
                        title={showArchived ? "Show Active" : "Show Archived"}
                      >
                        {showArchived ? <Inbox className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {filteredRecentChats.length > 0 && (
            <>
              <div className="mt-6 mb-2 px-2">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Chats</h4>
              </div>
              <div className="space-y-1">
                {filteredRecentChats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => handleChatSelect(chat.insightId)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{chat.insightTitle}</span>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <CreateTabModal open={isCreateTabModalOpen} onOpenChange={setIsCreateTabModalOpen} onCreateTab={onCreateTab} />
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[240px] border-r h-[calc(100vh-0rem)] sticky top-0">
        <SidebarContent />
      </div>
    </>
  )
}
