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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">常用城市</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {favoriteCities.map((city) => (
          <Button
            key={city.name}
            variant={city.name === currentCity ? "default" : "outline"}
            size="sm"
            onClick={() => handleCityClick(city.name)}
            className="h-auto p-2 flex flex-col items-center gap-1 min-w-[80px]"
          >
            <div className="flex items-center gap-1">
              {city.isCurrent && <MapPin className="w-3 h-3" />}
              <span className="text-xs font-medium">{city.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">{city.temp}°</span>
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {city.condition}
              </Badge>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
