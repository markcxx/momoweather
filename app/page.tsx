"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 移除未使用的WeatherCharts导入
import { SearchDialog } from "@/components/search-dialog"
import { EnhancedSearchDialog } from "@/components/enhanced-search-dialog"
import { DailyForecastPage } from "@/components/daily-forecast-page"
import { CityData } from "@/lib/data/city-data"
import { QuickCitySwitch } from "@/components/quick-city-switch"
import { AISuggestions } from "@/components/ai-suggestions"
import { WeatherAlerts } from "@/components/weather-alerts"
import { LifeIndices } from "@/components/life-indices"
import { AirQualityCard } from "@/components/air-quality-card"
import { NearbyCities } from "@/components/nearby-cities"
import { HourlyForecastChart } from "@/components/hourly-forecast-chart"
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
  Clock,
  Moon,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useHomePageData } from "@/hooks/use-weather-data"
import { API_CONFIG } from "@/lib/api"
import { initializeDemoEnvironment } from "@/lib/api/demo-setup"
import { GeoLocationService, type LocationInfo } from "@/lib/api/geo-location-service"

// 天气图标组件
function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  if (condition.includes("晴") || condition.includes("100")) return <Sun className={className} />
  if (condition.includes("雨") || condition.includes("3")) return <CloudRain className={className} />
  if (condition.includes("雪") || condition.includes("4")) return <CloudSnow className={className} />
  return <Cloud className={className} />
}

// 错误提示组件
function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          重试
        </Button>
      </CardContent>
    </Card>
  )
}



export default function WeatherApp() {
  const [location, setLocation] = useState("")
  const [locationId, setLocationId] = useState<string | null>(null) // 初始为null，避免默认请求北京数据
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  // 移除导航栏相关状态
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [autoLocationLoading, setAutoLocationLoading] = useState(true) // 初始为true，表示正在获取位置
  const [autoLocationError, setAutoLocationError] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  
  // 使用API数据Hook，只有locationId不为null时才请求数据
  const { data: homeData, loading, error, refetch } = useHomePageData(locationId || '')
  
  // 自动获取用户位置
  const autoGetLocation = async () => {
    setAutoLocationLoading(true)
    setAutoLocationError(null)
    
    try {
      const { locationInfo: userLocation, locationId: userLocationId } = await GeoLocationService.getLocationWithId()
      
      // 更新位置信息
      setLocationInfo(userLocation)
      // 优先显示区县名称，如果没有则显示城市名称，最后才是完整地址
      setLocation(userLocation.district || userLocation.city || userLocation.fullAddress)
      setLocationId(userLocationId)
      setCoordinates({
        lat: userLocation.latitude,
        lng: userLocation.longitude
      })
      
      console.log('自动定位成功:', {
        location: userLocation.fullAddress,
        locationId: userLocationId,
        coordinates: { lat: userLocation.latitude, lng: userLocation.longitude }
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取位置失败'
      setAutoLocationError(errorMessage)
      // 自动定位失败
      // 不再使用默认的北京数据，保持locationId为null
    } finally {
      setAutoLocationLoading(false)
    }
  }
  
  // 初始化演示环境和自动定位
  useEffect(() => {
    initializeDemoEnvironment()
    
    // 延迟执行自动定位，避免与其他初始化冲突
    const timer = setTimeout(() => {
      autoGetLocation()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleLocationSelect = (newLocation: string, newCoordinates?: { lat: number; lng: number }) => {
    setLocation(newLocation)
    if (newCoordinates) {
      setCoordinates(newCoordinates)
    }
    // TODO: 这里需要根据新位置获取LocationID，暂时使用默认值
    // 后续可以通过GeoService.getLocationId获取
  }
  
  // 处理城市选择
  const handleCitySelect = async (city: CityData) => {
    setSelectedCity(city)
    setLocation(city.fullName)
    
    // 显示加载状态
    
    try {
      // 调用geo/city/lookup接口获取正确的地区ID
      let newLocationId: string
      
      try {
        // 提取区县名称（去除省市信息，只保留区县部分）
        const extractDistrictName = (fullName: string, cityName: string): string => {
          // 移除省份信息（如"重庆市"、"北京市"等）
          let districtName = fullName
          
          // 常见的省市模式
          const patterns = [
            /^.+?省.+?市(.+)$/, // 省市区模式：如"四川省成都市锦江区" -> "锦江区"
            /^.+?市(.+)$/, // 直辖市模式：如"重庆市南岸区" -> "南岸区"
            /^.+?自治区.+?市(.+)$/, // 自治区模式
          ]
          
          for (const pattern of patterns) {
            const match = fullName.match(pattern)
            if (match && match[1]) {
              districtName = match[1]
              break
            }
          }
          
          // 如果没有匹配到模式，直接使用cityName
          if (districtName === fullName) {
            districtName = cityName
          }
          
          return districtName.trim()
        }
        
        const districtName = extractDistrictName(city.fullName, city.name)
        console.log('提取的区县名称:', districtName, '原始全名:', city.fullName)
        
        // 优先使用区县名称查询
        console.log('正在查询LocationID:', districtName)
        newLocationId = await GeoLocationService.getLocationIdByAPI(districtName)
        console.log('成功获取LocationID:', newLocationId)
      } catch (apiError) {
        console.warn('使用区县名称查询失败，尝试使用城市名称:', apiError)
        try {
          // 如果区县名称查询失败，尝试使用城市名称
          newLocationId = await GeoLocationService.getLocationIdByAPI(city.name)
          console.log('使用城市名称获取LocationID:', newLocationId)
        } catch (fallbackError) {
          console.warn('城市名称查询也失败，使用默认LocationID:', fallbackError)
          // 如果都失败了，使用默认的北京LocationID
          newLocationId = '101010100' // 使用北京的LocationID作为默认值
        }
      }
      
      setLocationId(newLocationId)
      
      // 可以在这里添加获取城市坐标的逻辑
      // 暂时使用默认坐标，实际项目中可以调用地理编码API
      
    } catch (error) {
      console.error('Failed to update city data:', error)
      // 发生错误时不设置LocationID，保持为null
    }
  }

  // 获取动态背景样式
  const getDynamicBackground = (condition: string) => {
    const hour = new Date().getHours()
    const isNight = hour >= 18 || hour <= 6
    
    if (isNight) {
      return "bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-blue-900/20"
    }
    
    // 根据天气状况图标代码或文字描述判断
    if (condition.includes("晴") || condition.includes("100")) {
      return "bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-pink-400/10"
    }
    if (condition.includes("雨") || condition.includes("3")) {
      return "bg-gradient-to-br from-gray-600/10 via-blue-600/10 to-blue-800/10"
    }
    if (condition.includes("雪") || condition.includes("4")) {
      return "bg-gradient-to-br from-blue-200/20 via-white/10 to-gray-300/10"
    }
    // 多云或其他
    return "bg-gradient-to-br from-gray-400/10 via-blue-400/10 to-indigo-500/10"
  }

  // 处理自动定位加载状态
  if (autoLocationLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4">
            <div 
              className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"
              style={{
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
          <p className="text-muted-foreground">正在获取您的位置...</p>
        </div>
      </div>
    )
  }

  // 处理自动定位失败状态
  if (autoLocationError && !locationId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">无法获取位置信息</h2>
            <p className="text-muted-foreground mb-4">{autoLocationError}</p>
            <div className="space-y-2">
              <Button onClick={autoGetLocation} className="mr-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                重新获取位置
              </Button>
              <p className="text-sm text-muted-foreground">或使用搜索功能手动选择城市</p>
              <EnhancedSearchDialog onLocationSelect={handleCitySelect} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 处理数据加载状态
  if (loading && locationId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4">
            <div 
              className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"
              style={{
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
          <p className="text-muted-foreground">正在加载天气数据...</p>
        </div>
      </div>
    )
  }

  // 处理错误状态
  if (error && locationId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <ErrorMessage error={error} onRetry={refetch} />
        </div>
      </div>
    )
  }

  // 获取当前天气数据
  const currentWeather = homeData?.currentWeather?.now
  const todayForecast = homeData?.dailyWeather7d?.daily?.[0]

  const renderMainContent = () => {
    return (
      <>
        {/* Current Weather */}
            <Card className={`relative overflow-hidden border-2 ${getDynamicBackground(currentWeather?.text || '')} backdrop-blur-sm`}>
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-30">
                {(currentWeather?.text?.includes("晴") || currentWeather?.icon === "100") && (
                  <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse" />
                )}
                {(currentWeather?.text?.includes("雨") || currentWeather?.icon?.startsWith("3")) && (
                  <div className="absolute inset-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-8 bg-blue-400/30 rounded-full animate-bounce"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${10 + i * 10}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {(currentWeather?.text?.includes("多云") || currentWeather?.icon?.startsWith("1")) && (
                  <div className="absolute top-2 right-8 w-12 h-8 bg-gray-400/20 rounded-full" />
                )}
              </div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <WeatherIcon condition={currentWeather?.text || ''} className="w-7 h-7" />
                    <span className="text-xl font-bold">实时天气</span>
                  </span>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">
                    {currentWeather?.text || '暂无数据'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Temperature Display */}
                  <div className="text-center lg:text-left space-y-3">
                    <div className="relative">
                      <div className="text-7xl font-bold text-primary mb-2 drop-shadow-sm">
                        {currentWeather?.temp || '--'}°C
                      </div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full animate-ping" />
                    </div>
                    <div className="text-lg font-medium text-foreground mb-2">
                      {currentWeather?.text || '暂无数据'}
                      <span className="text-sm text-muted-foreground ml-2">
                        {(currentWeather?.text?.includes("晴") || currentWeather?.icon === "100") && "天空晴朗，适合户外活动"}
                        {(currentWeather?.text?.includes("多云") || currentWeather?.icon?.startsWith("1")) && "天空多云，光线柔和"}
                        {currentWeather?.text?.includes("阴") && "天空阴沉，光线较暗"}
                        {(currentWeather?.text?.includes("雨") || currentWeather?.icon?.startsWith("3")) && "有降雨，请携带雨具"}
                        {(currentWeather?.text?.includes("雪") || currentWeather?.icon?.startsWith("4")) && "有降雪，注意保暖"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Thermometer className="w-4 h-4 text-primary" />
                        <p className="text-sm font-medium text-foreground">体感温度: {currentWeather?.feelsLike || '--'}°C</p>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">观测时间: {currentWeather?.obsTime ? new Date(currentWeather.obsTime).toLocaleString('zh-CN') : '--'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Weather Details Grid */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="group p-4 bg-background/70 hover:bg-background/90 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Wind className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">风速</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-foreground">{currentWeather?.windSpeed || '--'}km/h</div>
                          <div className="text-xs text-muted-foreground">{currentWeather?.windDir || '--'}</div>
                        </div>
                      </div>
                      
                      <div className="group p-4 bg-background/70 hover:bg-background/90 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Droplets className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">湿度</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-foreground">{currentWeather?.humidity || '--'}%</div>
                          <div className="text-xs text-muted-foreground">
                            {currentWeather?.humidity ? (
                              parseInt(currentWeather.humidity) < 40 ? '干燥' :
                              parseInt(currentWeather.humidity) < 70 ? '舒适' : '潮湿'
                            ) : '--'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="group p-4 bg-background/70 hover:bg-background/90 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Gauge className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">气压</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-foreground">{currentWeather?.pressure || '--'}hPa</div>
                          <div className="text-xs text-muted-foreground">
                            {currentWeather?.pressure ? (
                              parseInt(currentWeather.pressure) < 1000 ? '偏低' :
                              parseInt(currentWeather.pressure) < 1020 ? '正常' : '偏高'
                            ) : '--'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="group p-4 bg-background/70 hover:bg-background/90 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Eye className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">能见度</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-foreground">{currentWeather?.vis || '--'}km</div>
                          <div className="text-xs text-muted-foreground">
                            {currentWeather?.vis ? (
                              parseInt(currentWeather.vis) < 5 ? '较差' :
                              parseInt(currentWeather.vis) < 10 ? '一般' : '良好'
                            ) : '--'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 集成AI智能建议到实时天气板块内部 */}
                <div className="mt-6">
                  <AISuggestions />
                </div>
              </CardContent>
            </Card>

            {/* 24 Hour Forecast */}
            <HourlyForecastChart data={homeData?.hourlyWeather24h} />
            
            {/* Daily Forecast - 天气预报 */}
            <DailyForecastPage data={homeData?.dailyWeather7d} location={locationId || undefined} />

            {/* Weather Alerts */}
            <div className="space-y-4">
              <WeatherAlerts />
            </div>

            {/* Air Quality */}
            <AirQualityCard data={homeData?.currentAirQuality} />

            {/* Life Indices */}
            <LifeIndices data={homeData?.lifeIndices} />

            {/* Nearby Cities */}
            <NearbyCities />


      </>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sun className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary font-mono">墨墨天气</h1>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                首页
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                MCP服务
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                邮件订阅
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                关于
              </Button>
            </nav>

            {/* Search and Controls */}
            <div className="flex items-center gap-2">
              <EnhancedSearchDialog onLocationSelect={handleCitySelect} />
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative flex-1">
        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 space-y-6 overflow-x-hidden max-w-6xl mx-auto">
          {/* Quick City Switch */}
          <QuickCitySwitch onCitySelect={handleLocationSelect} />

          {/* Location Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">{location}</h2>
              {selectedCity && (
                <Badge variant="outline" className="text-xs">
                  {selectedCity.level === 'province' ? '省' : selectedCity.level === 'city' ? '市' : '区/县'}
                </Badge>
              )}
              {locationInfo && (
                <Badge variant="outline" className="text-xs">
                  {locationInfo.fullAddress}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {homeData?.updateTime ? new Date(homeData.updateTime).toLocaleString('zh-CN') : '--'}
              </Badge>
              <Button
                onClick={refetch}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={autoGetLocation}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={autoLocationLoading}
                title="重新定位"
              >
                <MapPin className={`w-4 h-4 ${autoLocationLoading ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {coordinates ? `${coordinates.lat.toFixed(4)}°, ${coordinates.lng.toFixed(4)}°` : '未获取坐标'}
              </Badge>
              {autoLocationLoading && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  定位中...
                </Badge>
              )}
              {autoLocationError && (
                <Badge variant="destructive" className="text-xs">
                  定位失败
                </Badge>
              )}
              {locationInfo && !autoLocationLoading && !autoLocationError && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  已定位
                </Badge>
              )}
              {homeData?.currentWeather?.code === '200' && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  数据正常
                </Badge>
              )}
            </div>
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
              © 2025 墨墨天气. 保留所有权利. | 数据来源: 和风天气 |<span className="ml-2">京ICP备12345678号</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
