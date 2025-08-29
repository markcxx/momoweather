"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, Info } from "lucide-react"
import { useState } from "react"

// Mock weather alerts data
const mockAlerts = [
  {
    id: 1,
    type: "warning",
    level: "黄色预警",
    title: "大风预警",
    description: "预计未来24小时内将有6-7级大风，阵风可达8级，请注意防范。",
    time: "2024-01-15 10:30",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-700",
    badgeColor: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-200",
  },
  {
    id: 2,
    type: "info",
    level: "蓝色预警",
    title: "降温提醒",
    description: "受冷空气影响，气温将下降8-10℃，请注意添衣保暖。",
    time: "2024-01-15 08:00",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-700",
    badgeColor: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200",
  },
]

export function WeatherAlerts() {
  const [alerts, setAlerts] = useState(mockAlerts)

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  if (alerts.length === 0) return null

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className={`${alert.bgColor} border-l-4 border-l-current ${alert.color} ${alert.borderColor}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-1 rounded-full ${alert.color}`}>
                  {alert.type === "warning" ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground">{alert.title}</h4>
                    <Badge variant="secondary" className={`text-xs ${alert.badgeColor} border-0`}>
                      {alert.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className="h-6 w-6 p-0 hover:bg-background/50 dark:hover:bg-foreground/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
