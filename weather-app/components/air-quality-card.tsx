"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind } from "lucide-react"

// Mock air quality data
const mockAirQuality = {
  aqi: 85,
  pm25: 35,
  pm10: 58,
  no2: 42,
  so2: 15,
  co: 0.8,
  o3: 120,
  level: "良",
  color: "text-yellow-600",
  bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
}

function getAQILevel(aqi: number) {
  if (aqi <= 50) return { level: "优", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/20" }
  if (aqi <= 100) return { level: "良", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/20" }
  if (aqi <= 150) return { level: "轻度污染", color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950/20" }
  if (aqi <= 200) return { level: "中度污染", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/20" }
  if (aqi <= 300) return { level: "重度污染", color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/20" }
  return { level: "严重污染", color: "text-red-800", bgColor: "bg-red-100 dark:bg-red-950/30" }
}

export function AirQualityCard() {
  const aqiInfo = getAQILevel(mockAirQuality.aqi)

  return (
    <Card className={`${aqiInfo.bgColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wind className={`w-5 h-5 ${aqiInfo.color}`} />
            空气质量指数
          </span>
          <Badge variant="secondary" className={`${aqiInfo.color} ${aqiInfo.bgColor}`}>
            {aqiInfo.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${aqiInfo.color} mb-2`}>{mockAirQuality.aqi}</div>
          <p className="text-sm text-muted-foreground">空气质量指数</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-semibold">{mockAirQuality.pm25}</div>
            <div className="text-xs text-muted-foreground">PM2.5</div>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-semibold">{mockAirQuality.pm10}</div>
            <div className="text-xs text-muted-foreground">PM10</div>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-semibold">{mockAirQuality.no2}</div>
            <div className="text-xs text-muted-foreground">NO₂</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-semibold">{mockAirQuality.so2}</div>
            <div className="text-xs text-muted-foreground">SO₂</div>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-semibold">{mockAirQuality.co}</div>
            <div className="text-xs text-muted-foreground">CO</div>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-semibold">{mockAirQuality.o3}</div>
            <div className="text-xs text-muted-foreground">O₃</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
