"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shirt, Dumbbell, Car, Sun, Umbrella, Plane } from "lucide-react"

// Mock life indices data
const mockLifeIndices = {
  clothing: { index: 3, level: "较舒适", description: "建议穿薄外套或针织衫", icon: Shirt, color: "text-blue-600" },
  exercise: { index: 4, level: "适宜", description: "天气较好，适合户外运动", icon: Dumbbell, color: "text-green-600" },
  carWash: { index: 2, level: "不宜", description: "预计有降水，不宜洗车", icon: Car, color: "text-red-600" },
  uv: { index: 3, level: "中等", description: "外出需要防晒措施", icon: Sun, color: "text-yellow-600" },
  umbrella: {
    index: 4,
    level: "需要",
    description: "有降水可能，建议携带雨具",
    icon: Umbrella,
    color: "text-blue-600",
  },
  travel: { index: 3, level: "较适宜", description: "天气一般，可安排出行", icon: Plane, color: "text-purple-600" },
}

export function LifeIndices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-primary" />
          生活指数
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(mockLifeIndices).map(([key, data]) => {
            const IconComponent = data.icon
            return (
              <div key={key} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`p-2 rounded-full bg-background ${data.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {key === "clothing" && "穿衣指数"}
                      {key === "exercise" && "运动指数"}
                      {key === "carWash" && "洗车指数"}
                      {key === "uv" && "紫外线指数"}
                      {key === "umbrella" && "雨伞指数"}
                      {key === "travel" && "出行指数"}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {data.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{data.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
