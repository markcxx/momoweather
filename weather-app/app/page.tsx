"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WeatherNavSidebar } from "@/components/weather-nav-sidebar"
import { WeatherCharts } from "@/components/weather-charts"
import { SearchDialog } from "@/components/search-dialog"
import { HourlyForecastPage } from "@/components/hourly-forecast-page"
import { DailyForecastPage } from "@/components/daily-forecast-page"
import { GridWeatherPage } from "@/components/grid-weather-page"
import { WeatherAlerts } from "@/components/weather-alerts"
import { AirQualityCard } from "@/components/air-quality-card"
import { LifeIndices } from "@/components/life-indices"
import { AISuggestions } from "@/components/ai-suggestions"
import { QuickCitySwitch } from "@/components/quick-city-switch"
import { WeatherShare } from "@/components/weather-share"
import { NearbyCities } from "@/components/nearby-cities"
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  MapPin,
  Menu,
  Bell,
  Activity,
  BarChart3,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

// Mock weather data
const mockCurrentWeather = {
  location: "北京",
  lastUpdated: "2024-01-15 14:30",
  observationTime: "2024-01-15 14:00",
  temperature: 8,
  condition: "多云",
  windDirection: 180,
  windDirectionText: "南风",
  windScale: 3,
  windSpeed: 15,
  humidity: 65,
  precipitation: 0,
  pressure: 1013,
  visibility: 10,
  cloudCover: 40,
}

const todayForecast = {
  date: "今天",
  maxTemp: 12,
  minTemp: 2,
  dayCondition: "晴转多云",
  nightCondition: "多云",
  uvIndex: 3,
  sunrise: "07:30",
  sunset: "17:45",
}

function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  if (condition.includes("晴")) return <Sun className={className} />
  if (condition.includes("雨")) return <CloudRain className={className} />
  if (condition.includes("雪")) return <CloudSnow className={className} />
  return <Cloud className={className} />
}

export default function WeatherApp() {
  const [location, setLocation] = useState("北京")
  const [coordinates, setCoordinates] = useState({ lat: 39.9042, lng: 116.4074 })
  const [navSidebarOpen, setNavSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState("overview")
  const { theme, setTheme } = useTheme()

  const handleLocationSelect = (newLocation: string, newCoordinates?: { lat: number; lng: number }) => {
    setLocation(newLocation)
    if (newCoordinates) {
      setCoordinates(newCoordinates)
    }
  }

  const renderMainContent = () => {
    switch (activeView) {
      case "hourly":
        return <HourlyForecastPage />
      case "daily":
        return <DailyForecastPage />
      case "grid":
        return <GridWeatherPage />
      default:
        return (
          <>
            {/* Quick City Switch */}
            <QuickCitySwitch onCitySelect={handleLocationSelect} />

            {/* AI Suggestions */}
            <AISuggestions />

            {/* Current Weather and Today's Forecast */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Current Weather */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <WeatherIcon condition={mockCurrentWeather.condition} className="w-6 h-6" />
                      实时天气
                    </span>
                    <Badge variant="secondary">{mockCurrentWeather.condition}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{mockCurrentWeather.temperature}°C</div>
                    <p className="text-sm text-muted-foreground">观测时间: {mockCurrentWeather.observationTime}</p>
                  </div>

                  {/* Weather Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-primary" />
                        <span className="text-sm">风速</span>
                      </div>
                      <span className="text-sm font-medium">{mockCurrentWeather.windSpeed}km/h</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-primary" />
                        <span className="text-sm">湿度</span>
                      </div>
                      <span className="text-sm font-medium">{mockCurrentWeather.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-primary" />
                        <span className="text-sm">气压</span>
                      </div>
                      <span className="text-sm font-medium">{mockCurrentWeather.pressure}hPa</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <span className="text-sm">能见度</span>
                      </div>
                      <span className="text-sm font-medium">{mockCurrentWeather.visibility}km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Forecast */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Thermometer className="w-6 h-6" />
                      今日预报
                    </span>
                    <Badge>UV {todayForecast.uvIndex}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {todayForecast.maxTemp}° / {todayForecast.minTemp}°
                    </div>
                    <p className="text-muted-foreground">{todayForecast.dayCondition}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-primary" />
                        <span className="text-sm">日出</span>
                      </div>
                      <span className="text-sm font-medium">{todayForecast.sunrise}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-primary" />
                        <span className="text-sm">日落</span>
                      </div>
                      <span className="text-sm font-medium">{todayForecast.sunset}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">夜间天气</span>
                      <span className="text-sm font-medium">{todayForecast.nightCondition}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Air Quality and Life Indices */}
            <div className="grid gap-6 lg:grid-cols-2">
              <AirQualityCard />
              <LifeIndices />
            </div>

            {/* Weather Sharing */}
            <WeatherShare
              location={location}
              temperature={mockCurrentWeather.temperature}
              condition={mockCurrentWeather.condition}
              maxTemp={todayForecast.maxTemp}
              minTemp={todayForecast.minTemp}
            />

            {/* Nearby Cities */}
            <NearbyCities />

            {/* Weather Alerts */}
            <WeatherAlerts />

            {/* Weather Charts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">数据可视化</h3>
              <WeatherCharts />
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNavSidebarOpen(!navSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Sun className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary font-mono">墨墨天气</h1>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                天气预报
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <Activity className="w-4 h-4 mr-2" />
                空气质量
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <Bell className="w-4 h-4 mr-2" />
                天气预警
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <BarChart3 className="w-4 h-4 mr-2" />
                天气指数
              </Button>
            </nav>

            {/* Search and Controls */}
            <div className="flex items-center gap-2">
              <SearchDialog onLocationSelect={handleLocationSelect} />
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative flex-1">
        <WeatherNavSidebar
          isOpen={navSidebarOpen}
          onClose={() => setNavSidebarOpen(false)}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Left Navigation Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 border-r border-border">
          <WeatherNavSidebar isOpen={true} onClose={() => {}} activeView={activeView} onViewChange={setActiveView} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6">
          {/* Location Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">{location}</h2>
              <Badge variant="secondary" className="text-xs">
                {mockCurrentWeather.lastUpdated}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              {coordinates.lat.toFixed(4)}°, {coordinates.lng.toFixed(4)}°
            </Badge>
          </div>

          {renderMainContent()}
        </main>
      </div>

      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">关于墨墨天气</h3>
              <p className="text-sm text-muted-foreground">
                提供准确、及时的天气预报服务，让您随时掌握天气变化，合理安排出行计划。
              </p>
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                <span className="font-mono font-semibold text-primary">墨墨天气</span>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">服务功能</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>实时天气监测</li>
                <li>逐小时预报</li>
                <li>15天天气预报</li>
                <li>空气质量指数</li>
                <li>天气预警提醒</li>
                <li>生活指数建议</li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">帮助支持</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>使用帮助</li>
                <li>常见问题</li>
                <li>意见反馈</li>
                <li>联系我们</li>
                <li>隐私政策</li>
                <li>服务条款</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">联系方式</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>客服邮箱: support@momoweather.com</p>
                <p>技术支持: tech@momoweather.com</p>
                <p>商务合作: business@momoweather.com</p>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary" className="text-xs">
                    v2.1.0
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    API v3.0
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 墨墨天气. 保留所有权利. | 数据来源: 中国气象局 |<span className="ml-2">京ICP备12345678号</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
