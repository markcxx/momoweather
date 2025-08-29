"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Cloud, Sun, CloudRain, Wind, Droplets, Gauge, Thermometer } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"

const mockGridData = Array.from({ length: 25 }, (_, i) => ({
  lat: 39.9 + (Math.floor(i / 5) - 2) * 0.1,
  lng: 116.4 + ((i % 5) - 2) * 0.1,
  temperature: Math.round(8 + Math.random() * 10),
  condition: i % 4 === 0 ? "晴" : i % 3 === 0 ? "多云" : "阴",
  windSpeed: Math.round(5 + Math.random() * 15),
  humidity: Math.round(50 + Math.random() * 30),
  pressure: Math.round(1005 + Math.random() * 20),
}))

function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  if (condition.includes("晴")) return <Sun className={className} />
  if (condition.includes("雨")) return <CloudRain className={className} />
  if (condition.includes("雪")) return <CloudRain className={className} />
  return <Cloud className={className} />
}

export function GridWeatherPage() {
  const [latitude, setLatitude] = useState("39.9042")
  const [longitude, setLongitude] = useState("116.4074")
  const [selectedPoint, setSelectedPoint] = useState<any>(null)

  const handleSearch = () => {
    // Find closest grid point
    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)
    const closest = mockGridData.reduce((prev, curr) => {
      const prevDist = Math.abs(prev.lat - lat) + Math.abs(prev.lng - lng)
      const currDist = Math.abs(curr.lat - lat) + Math.abs(curr.lng - lng)
      return currDist < prevDist ? curr : prev
    })
    setSelectedPoint(closest)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude.toFixed(4))
        setLongitude(position.coords.longitude.toFixed(4))
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">格点天气预报</h1>
        <Badge variant="secondary">精确到0.1°网格</Badge>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            位置搜索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="latitude">纬度</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="39.9042"
              />
            </div>
            <div>
              <Label htmlFor="longitude">经度</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="116.4074"
              />
            </div>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              搜索天气
            </Button>
            <Button variant="outline" onClick={getCurrentLocation} className="flex items-center gap-2 bg-transparent">
              <MapPin className="w-4 h-4" />
              当前位置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Point Weather */}
      {selectedPoint && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              格点天气详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">坐标</div>
                <div className="font-semibold">
                  {selectedPoint.lat.toFixed(4)}°N
                  <br />
                  {selectedPoint.lng.toFixed(4)}°E
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">温度</div>
                <div className="text-3xl font-bold text-primary">{selectedPoint.temperature}°</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">天气</div>
                <div className="flex items-center justify-center gap-2">
                  <WeatherIcon condition={selectedPoint.condition} />
                  <span>{selectedPoint.condition}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">风速</div>
                <div className="flex items-center justify-center gap-1">
                  <Wind className="w-4 h-4" />
                  <span>{selectedPoint.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            温度分布图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={mockGridData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lng" domain={["dataMin", "dataMax"]} />
              <YAxis dataKey="lat" domain={["dataMin", "dataMax"]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-card border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">
                          坐标: {data.lat.toFixed(4)}°, {data.lng.toFixed(4)}°
                        </p>
                        <p>温度: {data.temperature}°</p>
                        <p>天气: {data.condition}</p>
                        <p>风速: {data.windSpeed} km/h</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter dataKey="temperature" fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grid Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>格点数据列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockGridData.map((point, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPoint(point)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      {point.lat.toFixed(2)}°, {point.lng.toFixed(2)}°
                    </div>
                    <WeatherIcon condition={point.condition} className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">{point.temperature}°</span>
                      <span className="text-sm text-muted-foreground">{point.condition}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        <span>{point.windSpeed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        <span>{point.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        <span>{point.pressure}</span>
                      </div>
                    </div>
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
