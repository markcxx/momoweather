"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind } from "lucide-react"
import type { CurrentAirQualityResponse } from "@/lib/api"

interface AirQualityCardProps {
  data?: CurrentAirQualityResponse | null
}

function getAQILevel(aqi: number) {
  if (aqi <= 50) return { level: "优", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/20" }
  if (aqi <= 100) return { level: "良", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/20" }
  if (aqi <= 150) return { level: "轻度污染", color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950/20" }
  if (aqi <= 200) return { level: "中度污染", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/20" }
  if (aqi <= 300) return { level: "重度污染", color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/20" }
  return { level: "严重污染", color: "text-red-800", bgColor: "bg-red-100 dark:bg-red-950/30" }
}

export function AirQualityCard({ data }: AirQualityCardProps) {
  // 如果没有数据，显示占位符
  if (!data || !data.indexes || data.indexes.length === 0) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-950/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-gray-500" />
              空气质量指数
            </span>
            <Badge variant="secondary" className="text-gray-500">
              暂无数据
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-500 mb-2">--</div>
            <p className="text-sm text-muted-foreground">空气质量数据暂不可用</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const mainIndex = data.indexes[0]
  const aqi = Math.round(mainIndex.aqi)
  const aqiInfo = getAQILevel(aqi)

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
          <div className={`text-4xl font-bold ${aqiInfo.color} mb-2`}>{aqi}</div>
          <p className="text-sm text-muted-foreground">空气质量指数</p>
          {mainIndex.category && (
            <p className="text-xs text-muted-foreground mt-1">{mainIndex.category}</p>
          )}
          {mainIndex.health?.effect && (
            <p className="text-xs text-muted-foreground mt-2 px-2">{mainIndex.health.effect}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.pollutants && data.pollutants.map((pollutant) => (
            <div key={pollutant.code} className="text-center p-2 bg-background/50 rounded-lg">
              <div className="text-lg font-semibold">
                {Math.round(pollutant.concentration.value)}
              </div>
              <div className="text-xs text-muted-foreground">
                {pollutant.name}
              </div>
              <div className="text-xs text-muted-foreground opacity-70">
                {pollutant.concentration.unit}
              </div>
            </div>
          ))}
          {(!data.pollutants || data.pollutants.length === 0) && (
            <div className="col-span-full text-center p-4">
              <div className="text-sm text-muted-foreground">暂无污染物数据</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}