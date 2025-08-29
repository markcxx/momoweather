"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import { useState } from "react"

// Mock favorite cities data
const favoriteCities = [
  { name: "北京", temp: 8, condition: "多云", isCurrent: true },
  { name: "上海", temp: 12, condition: "晴" },
  { name: "广州", temp: 18, condition: "小雨" },
  { name: "深圳", temp: 20, condition: "晴" },
  { name: "杭州", temp: 10, condition: "阴" },
]

interface QuickCitySwitchProps {
  onCitySelect: (city: string) => void
}

export function QuickCitySwitch({ onCitySelect }: QuickCitySwitchProps) {
  const [currentCity, setCurrentCity] = useState("北京")

  const handleCityClick = (cityName: string) => {
    setCurrentCity(cityName)
    onCitySelect(cityName)
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">常用城市:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {favoriteCities.map((city) => (
          <Button
            key={city.name}
            variant={city.name === currentCity ? "default" : "ghost"}
            size="sm"
            onClick={() => handleCityClick(city.name)}
            className="h-8 px-3 text-sm"
          >
            <div className="flex items-center gap-1">
              {city.isCurrent && <MapPin className="w-3 h-3" />}
              <span>{city.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}