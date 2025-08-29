"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"

// Mock nearby cities data
const nearbyCities = [
  { name: "天津", distance: "120km", temp: 6, condition: "晴", direction: "东南" },
  { name: "石家庄", distance: "280km", temp: 4, condition: "多云", direction: "西南" },
  { name: "济南", distance: "400km", temp: 8, condition: "阴", direction: "东南" },
  { name: "太原", distance: "500km", temp: 2, condition: "小雪", direction: "西" },
  { name: "沈阳", distance: "680km", temp: -2, condition: "晴", direction: "东北" },
  { name: "郑州", distance: "700km", temp: 7, condition: "多云", direction: "南" },
]

function getConditionColor(condition: string) {
  if (condition.includes("晴")) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20"
  if (condition.includes("雨") || condition.includes("雪")) return "text-blue-600 bg-blue-50 dark:bg-blue-950/20"
  if (condition.includes("多云")) return "text-gray-600 bg-gray-50 dark:bg-gray-950/20"
  return "text-gray-600 bg-gray-50 dark:bg-gray-950/20"
}

export function NearbyCities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          周边城市天气
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nearbyCities.map((city) => (
            <div
              key={city.name}
              className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium text-sm">{city.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {city.distance}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-primary">{city.temp}°</div>
                <Badge variant="secondary" className={`text-xs ${getConditionColor(city.condition)}`}>
                  {city.condition}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{city.direction}方向</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
