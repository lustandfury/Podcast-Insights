"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock companies for the demo
const COMPANIES = ["Apple", "Microsoft", "Google", "Amazon", "Tesla", "Meta", "Netflix", "Nvidia", "AMD", "Intel"]

export interface TabFilter {
  companies: string[]
  sectors: string[]
  keywords: string[]
}

interface CreateTabModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTab: (name: string, filters: TabFilter) => void
}

export function CreateTabModal({ open, onOpenChange, onCreateTab }: CreateTabModalProps) {
  const [tabName, setTabName] = useState("")
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [sectors, setSectors] = useState<string[]>([])
  const [currentSector, setCurrentSector] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState("")

  const handleAddCompany = (company: string) => {
    if (!selectedCompanies.includes(company)) {
      setSelectedCompanies([...selectedCompanies, company])
    }
  }

  const handleRemoveCompany = (company: string) => {
    setSelectedCompanies(selectedCompanies.filter((c) => c !== company))
  }

  const handleAddSector = () => {
    if (currentSector.trim() && !sectors.includes(currentSector.trim())) {
      setSectors([...sectors, currentSector.trim()])
      setCurrentSector("")
    }
  }

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()])
      setCurrentKeyword("")
    }
  }

  const handleSubmit = () => {
    if (tabName.trim() && selectedCompanies.length > 0) {
      onCreateTab(tabName.trim(), {
        companies: selectedCompanies,
        sectors: sectors,
        keywords: keywords,
      })

      // Reset form
      setTabName("")
      setSelectedCompanies([])
      setSectors([])
      setKeywords([])
      setCurrentSector("")
      setCurrentKeyword("")

      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Custom Tab</DialogTitle>
          <DialogDescription>Create a new tab with custom filters to organize your insights.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tab-name">Tab Name</Label>
            <Input
              id="tab-name"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="My Custom Tab"
            />
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center">
              Companies <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select onValueChange={handleAddCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Select companies" />
              </SelectTrigger>
              <SelectContent>
                {COMPANIES.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCompanies.map((company) => (
                <Badge key={company} variant="secondary" className="flex items-center gap-1">
                  {company}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveCompany(company)} />
                </Badge>
              ))}
              {selectedCompanies.length === 0 && <p className="text-sm text-muted-foreground">No companies selected</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sectors">Sectors</Label>
            <div className="flex gap-2">
              <Input
                id="sectors"
                value={currentSector}
                onChange={(e) => setCurrentSector(e.target.value)}
                placeholder="Add a sector"
              />
              <Button type="button" size="sm" onClick={handleAddSector}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {sectors.map((sector) => (
                <Badge key={sector} variant="secondary" className="flex items-center gap-1">
                  {sector}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSectors(sectors.filter((s) => s !== sector))}
                  />
                </Badge>
              ))}
              {sectors.length === 0 && <p className="text-sm text-muted-foreground">No sectors added</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                placeholder="Add a keyword"
              />
              <Button type="button" size="sm" onClick={handleAddKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setKeywords(keywords.filter((k) => k !== keyword))}
                  />
                </Badge>
              ))}
              {keywords.length === 0 && <p className="text-sm text-muted-foreground">No keywords added</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!tabName.trim() || selectedCompanies.length === 0}>
            Create Tab
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
