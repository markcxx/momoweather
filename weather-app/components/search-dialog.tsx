"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Navigation } from "lucide-react"

interface SearchDialogProps {
  onLocationSelect: (location: string, coordinates?: { lat: number; lng: number }) => void
}

export function SearchDialog({ onLocationSelect }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Mock search results
  const searchResults = [
    { name: "北京", type: "city", coordinates: { lat: 39.9042, lng: 116.4074 } },
    { name: "上海", type: "city", coordinates: { lat: 31.2304, lng: 121.4737 } },
    { name: "广州", type: "city", coordinates: { lat: 23.1291, lng: 113.2644 } },
    { name: "深圳", type: "city", coordinates: { lat: 22.5431, lng: 114.0579 } },
  ]

  const handleLocationSelect = (location: string, coordinates?: { lat: number; lng: number }) => {
    onLocationSelect(location, coordinates)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleCoordinateSearch = () => {
    const coords = searchQuery.split(",").map((s) => Number.parseFloat(s.trim()))
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      handleLocationSelect(`${coords[0]}, ${coords[1]}`, { lat: coords[0], lng: coords[1] })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">搜索位置</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>搜索位置</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入城市名或经纬度 (如: 39.9042, 116.4074)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleCoordinateSearch} disabled={!searchQuery.includes(",")}>
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">热门城市</div>
            {searchResults
              .filter((result) => searchQuery === "" || result.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((result, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleLocationSelect(result.name, result.coordinates)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {result.name}
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {result.type === "city" ? "城市" : "坐标"}
                  </Badge>
                </Button>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
