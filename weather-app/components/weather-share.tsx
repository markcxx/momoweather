"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Download, Copy, Sun } from "lucide-react"
import { useState } from "react"

interface WeatherShareProps {
  location: string
  temperature: number
  condition: string
  maxTemp: number
  minTemp: number
}

export function WeatherShare({ location, temperature, condition, maxTemp, minTemp }: WeatherShareProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateShareCard = async () => {
    setIsGenerating(true)
    // Simulate card generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    const shareText = `${location}天气：${temperature}°C ${condition}，今日${maxTemp}°/${minTemp}° - 来自墨墨天气`
    navigator.clipboard.writeText(shareText)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">天气分享</h3>
      </div>

      {/* Preview Card */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-orange-200 dark:border-orange-700/50">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sun className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              <h4 className="font-bold text-lg text-orange-700 dark:text-orange-200">墨墨天气</h4>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{location}</h3>
              <div className="text-3xl font-bold text-primary">{temperature}°C</div>
              <Badge
                variant="secondary"
                className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-200 border-orange-200 dark:border-orange-700"
              >
                {condition}
              </Badge>
              <p className="text-sm text-muted-foreground">
                今日 {maxTemp}° / {minTemp}°
              </p>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-orange-200 dark:border-orange-700/50">
              {new Date().toLocaleDateString("zh-CN")} · 墨墨天气
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={generateShareCard}
          disabled={isGenerating}
          className="flex-1 bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? "生成中..." : "下载卡片"}
        </Button>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1 bg-transparent">
          <Copy className="w-4 h-4 mr-2" />
          复制文字
        </Button>
      </div>
    </div>
  )
}
