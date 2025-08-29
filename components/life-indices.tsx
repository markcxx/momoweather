"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shirt, Dumbbell, Car, Sun, Umbrella, Plane, Thermometer, Wind } from "lucide-react"
import type { WeatherIndicesResponse } from "@/lib/api"

interface LifeIndicesProps {
  data?: WeatherIndicesResponse | null
}

// 指数类型映射
const indexTypeMap: Record<string, { name: string; icon: any; color: string }> = {
  '0': { name: '全部天气指数', icon: Sun, color: 'text-gray-600' },
  '1': { name: '运动指数', icon: Dumbbell, color: 'text-green-600' },
  '2': { name: '洗车指数', icon: Car, color: 'text-blue-600' },
  '3': { name: '穿衣指数', icon: Shirt, color: 'text-purple-600' },
  '4': { name: '钓鱼指数', icon: Umbrella, color: 'text-teal-600' },
  '5': { name: '紫外线指数', icon: Sun, color: 'text-yellow-600' },
  '6': { name: '旅游指数', icon: Plane, color: 'text-indigo-600' },
  '7': { name: '花粉过敏指数', icon: Wind, color: 'text-pink-600' },
  '8': { name: '舒适度指数', icon: Thermometer, color: 'text-green-600' },
  '9': { name: '感冒指数', icon: Thermometer, color: 'text-red-600' },
  '10': { name: '空气污染扩散条件指数', icon: Wind, color: 'text-gray-600' },
  '11': { name: '空调开启指数', icon: Thermometer, color: 'text-orange-600' },
  '12': { name: '太阳镜指数', icon: Sun, color: 'text-amber-600' },
  '13': { name: '化妆指数', icon: Sun, color: 'text-rose-600' },
  '14': { name: '晾晒指数', icon: Sun, color: 'text-cyan-600' },
  '15': { name: '交通指数', icon: Car, color: 'text-slate-600' },
  '16': { name: '防晒指数', icon: Sun, color: 'text-orange-600' },
}

export function LifeIndices({ data }: LifeIndicesProps) {
  // 如果没有数据，显示占位符
  if (!data || !data.daily || data.daily.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary" />
            生活指数
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">生活指数数据暂不可用</p>
          </div>
        </CardContent>
      </Card>
    )
  }
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
          {data.daily.map((index) => {
            const typeInfo = indexTypeMap[index.type] || {
              name: index.name || `指数${index.type}`,
              icon: Sun,
              color: 'text-gray-600'
            }
            const IconComponent = typeInfo.icon
            
            return (
              <div key={index.type} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`p-2 rounded-full bg-background ${typeInfo.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {typeInfo.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {index.category || index.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{index.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}