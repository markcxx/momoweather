"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Eye, Gauge } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// TODO: 替换为真实的逐小时天气数据API调用
// 当前使用虚拟数据，需要集成真实的小时级天气预报服务
const mockHourlyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  temperature: Math.round(8 + Math.sin(i / 4) * 5),
  condition: i % 4 === 0 ? "晴" : i % 3 === 0 ? "多云" : "阴",
  windSpeed: Math.round(10 + Math.random() * 10),
  humidity: Math.round(60 + Math.random() * 20),
  pressure: Math.round(1010 + Math.random() * 20),
  visibility: Math.round(8 + Math.random() * 7),
  precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 5) : 0,
}))

function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  if (condition.includes("晴")) return <Sun className={className} />
  if (condition.includes("雨")) return <CloudRain className={className} />
  if (condition.includes("雪")) return <CloudSnow className={className} />
  return <Cloud className={className} />
}

export function HourlyForecastPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">逐小时天气预报</h1>
        <Badge variant="secondary">未来24小时</Badge>
      </div>

      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            温度变化趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockHourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Humidity and Wind Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              湿度变化
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={mockHourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="humidity" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              风速变化
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={mockHourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="windSpeed" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Hourly Cards */}
      <Card>
        <CardHeader>
          <CardTitle>详细预报</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockHourlyData.map((hour, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-lg">{hour.time}</span>
                    <WeatherIcon condition={hour.condition} className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{hour.temperature}°</span>
                      <span className="text-sm text-muted-foreground">{hour.condition}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        <span>{hour.windSpeed}km/h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        <span>{hour.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        <span>{hour.pressure}hPa</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{hour.visibility}km</span>
                      </div>
                    </div>

                    {hour.precipitation > 0 && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <CloudRain className="w-3 h-3" />
                        <span>{hour.precipitation}mm</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
