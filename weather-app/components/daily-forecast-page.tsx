"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, CloudSnow, Sunrise, Sunset, Wind, Droplets, Thermometer } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const generateDailyData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      date: date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
      fullDate: date.toLocaleDateString("zh-CN"),
      dayOfWeek: date.toLocaleDateString("zh-CN", { weekday: "short" }),
      maxTemp: Math.round(15 + Math.sin(i / 7) * 8),
      minTemp: Math.round(5 + Math.sin(i / 7) * 5),
      condition: i % 4 === 0 ? "晴" : i % 3 === 0 ? "多云" : "小雨",
      dayCondition: i % 4 === 0 ? "晴" : i % 3 === 0 ? "多云" : "阴",
      nightCondition: i % 5 === 0 ? "晴" : i % 3 === 0 ? "多云" : "阴",
      windSpeed: Math.round(8 + Math.random() * 12),
      humidity: Math.round(50 + Math.random() * 30),
      pressure: Math.round(1005 + Math.random() * 25),
      visibility: Math.round(6 + Math.random() * 9),
      uvIndex: Math.round(2 + Math.random() * 8),
      sunrise: `06:${String(20 + Math.round(Math.random() * 40)).padStart(2, "0")}`,
      sunset: `18:${String(10 + Math.round(Math.random() * 40)).padStart(2, "0")}`,
      precipitation: Math.random() > 0.6 ? Math.round(Math.random() * 15) : 0,
    }
  })
}

function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  if (condition.includes("晴")) return <Sun className={className} />
  if (condition.includes("雨")) return <CloudRain className={className} />
  if (condition.includes("雪")) return <CloudSnow className={className} />
  return <Cloud className={className} />
}

export function DailyForecastPage() {
  const [selectedDays, setSelectedDays] = useState(7)
  const dailyData = generateDailyData(selectedDays)

  const dayOptions = [3, 7, 10, 15, 30]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">每日天气预报</h1>
        <div className="flex gap-2">
          {dayOptions.map((days) => (
            <Button
              key={days}
              variant={selectedDays === days ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDays(days)}
            >
              {days}天
            </Button>
          ))}
        </div>
      </div>

      {/* Temperature Range Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            温度范围趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="maxTemp"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                stackId="1"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dailyData.map((day, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold">{day.dayOfWeek}</div>
                  <div className="text-sm text-muted-foreground">{day.date}</div>
                </div>
                <WeatherIcon condition={day.condition} className="w-10 h-10" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{day.maxTemp}°</span>
                  <span className="text-lg text-muted-foreground">{day.minTemp}°</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>白天: {day.dayCondition}</span>
                    <span>夜间: {day.nightCondition}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Wind className="w-3 h-3" />
                      <span>{day.windSpeed}km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sunrise className="w-3 h-3" />
                      <span>{day.sunrise}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sunset className="w-3 h-3" />
                      <span>{day.sunset}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Sun className="w-3 h-3" />
                      <span>UV {day.uvIndex}</span>
                    </div>
                    {day.precipitation > 0 && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <CloudRain className="w-3 h-3" />
                        <span>{day.precipitation}mm</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="w-5 h-5" />
              降水量预报
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData.filter((d) => d.precipitation > 0)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="precipitation" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              紫外线指数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="uvIndex" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
