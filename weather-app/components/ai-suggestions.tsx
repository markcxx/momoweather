"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shirt, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

// Mock AI suggestions
const mockSuggestions = {
  clothing:
    "根据当前8°C的温度和多云天气，建议您穿着薄外套或毛衣，搭配长裤和舒适的鞋子。由于湿度较高，选择透气性好的面料会更舒适。",
  travel:
    "今日天气较为适宜出行，但下午可能有轻微降水。建议您在上午安排户外活动，下午选择室内场所。如需外出，请携带雨具以备不时之需。",
}

function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed])

  useEffect(() => {
    setDisplayText("")
    setCurrentIndex(0)
  }, [text])

  return (
    <span>
      {displayText}
      {currentIndex < text.length && <span className="animate-pulse text-primary">|</span>}
    </span>
  )
}

export function AISuggestions() {
  const [activeTab, setActiveTab] = useState<"clothing" | "travel">("clothing")

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          AI智能建议
          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
            实时推荐
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("clothing")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "clothing"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <Shirt className="w-4 h-4" />
            穿衣建议
          </button>
          <button
            onClick={() => setActiveTab("travel")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "travel"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <MapPin className="w-4 h-4" />
            出行建议
          </button>
        </div>

        {/* Suggestion Content */}
        <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
          <div className="text-sm text-foreground leading-relaxed min-h-[4rem]">
            <TypewriterText
              text={activeTab === "clothing" ? mockSuggestions.clothing : mockSuggestions.travel}
              speed={30}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>基于当前天气条件智能分析</span>
          <Badge variant="outline" className="text-xs">
            AI推荐
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
