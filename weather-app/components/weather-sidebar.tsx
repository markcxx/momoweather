"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, CloudSnow, Clock } from "lucide-react"

const mockHourlyForecast = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  temperature: Math.round(8 + Math.sin(i / 4) * 5),
  condition: i % 4 === 0 ? "晴" : i % 3 === 0 ? "多云" : "阴",
  windSpeed: Math.round(10 + Math.random() * 10),
  humidity: Math.round(60 + Math.random() * 20),
}))

function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  if (condition.includes("晴")) return <Sun className={className} />
  if (condition.includes("雨")) return <CloudRain className={className} />
  if (condition.includes("雪")) return <CloudSnow className={className} />
  return <Cloud className={className} />
}

interface WeatherSidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
}

export function WeatherSidebar({ isOpen, onClose, isCollapsed }: WeatherSidebarProps) {
  if (!isOpen || isCollapsed) return null

  return (
    <div className="fixed inset-0 z-30 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />

      {/* Sidebar content */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-card border-l border-border overflow-y-auto lg:relative lg:top-0 lg:h-full">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">今日详情</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              ✕
            </Button>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-2">未来24小时</div>
            <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {mockHourlyForecast.map((hour, index) => (
                <Card key={index} className="flex-shrink-0">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm font-medium">{hour.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <WeatherIcon condition={hour.condition} className="w-4 h-4" />
                        <span className="font-bold text-primary">{hour.temperature}°</span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>{hour.condition}</span>
                      <span>{hour.windSpeed}km/h</span>
                      <span>{hour.humidity}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
