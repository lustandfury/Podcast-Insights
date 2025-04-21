"use client"

import { useState } from "react"
import { Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CreateTabModal, type TabFilter } from "@/components/create-tab-modal"
import type { CustomTab } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  customTabs: CustomTab[]
  onTabChange: (tabId: string) => void
  onCreateTab: (name: string, filters: TabFilter) => void
}

export function Sidebar({ activeTab, customTabs, onTabChange, onCreateTab }: SidebarProps) {
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false)

  const tabs = [
    { id: "all", name: "All Insights" },
    { id: "saved", name: "Saved" },
    { id: "market", name: "Market Updates" },
    { id: "strategy", name: "Investment Strategy" },
  ]

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <Button variant="outline" size="sm" onClick={() => setIsCreateTabModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Feed
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className={cn("w-full justify-start text-left font-normal", activeTab === tab.id && "font-medium")}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.name}
              </Button>
            ))}
          </div>

          {customTabs.length > 0 && (
            <>
              <div className="mt-6 mb-2 px-2">
                <h4 className="text-sm font-medium text-muted-foreground">Custom Tabs</h4>
              </div>
              <div className="space-y-1">
                {customTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className={cn("w-full justify-start text-left font-normal", activeTab === tab.id && "font-medium")}
                    onClick={() => onTabChange(tab.id)}
                  >
                    {tab.name}
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
      <div className="hidden lg:block w-[240px] border-r h-[calc(100vh-4rem)] sticky top-16">
        <SidebarContent />
      </div>
    </>
  )
}
