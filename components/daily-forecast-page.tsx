"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, CloudSnow, Sunrise, Sunset, Wind, Droplets, Thermometer, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import * as echarts from "echarts"
import { useTheme } from "next-themes"
import type { DailyWeatherResponse } from "@/lib/api"
import { useDailyWeather } from "@/hooks/use-weather-data"
import { API_CONFIG } from "@/lib/api"

// 移除虚拟数据生成函数，改为使用真实API数据

function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  if (condition.includes("晴")) return <Sun className={className} />
  if (condition.includes("雨")) return <CloudRain className={className} />
  if (condition.includes("雪")) return <CloudSnow className={className} />
  return <Cloud className={className} />
}

function TemperatureTrendChart({ data }: { data: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // 处理真实数据
  const chartData = (data || []).map(item => {
    const date = new Date(item.fxDate)
    return {
      date: date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
      maxTemp: parseInt(item.tempMax),
      minTemp: parseInt(item.tempMin),
    }
  })

  // 将useEffect移到条件返回之前，确保Hooks顺序一致
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    const chart = echarts.init(chartRef.current)
    const isDark = theme === "dark"

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
        borderColor: isDark ? "#333" : "#ccc",
        textStyle: {
          color: isDark ? "#fff" : "#333",
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.map((item) => item.date),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: isDark ? "#444" : "#ccc",
          },
        },
        axisLabel: {
          color: isDark ? "#ccc" : "#666",
          interval: 0,
          rotate: chartData.length > 10 ? 45 : 0,
          margin: 6,
          fontSize: 11,
          overflow: "truncate",
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        name: "温度 (°C)",
        axisLine: {
          lineStyle: {
            color: isDark ? "#444" : "#ccc",
          },
        },
        axisLabel: {
          color: isDark ? "#ccc" : "#666",
          formatter: "{value}°C",
        },
        splitLine: {
          lineStyle: {
            color: isDark ? "#333" : "#f0f0f0",
          },
        },
      },
      dataZoom: [
        {
          type: "slider",
          show: chartData.length > 10,
          start: 0,
          end: chartData.length > 20 ? 50 : 100,
          height: 20,
          bottom: 40,
        },
        {
          type: "inside",
        },
      ],
      series: [
        {
          name: '最高温度',
          data: chartData.map((item) => item.maxTemp),
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#ff6b6b",
            width: 3,
          },
          itemStyle: {
            color: "#ff6b6b",
          },
        },
        {
          name: '最低温度',
          data: chartData.map((item) => item.minTemp),
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#4ecdc4",
            width: 3,
          },
          itemStyle: {
            color: "#4ecdc4",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(80, 112, 221, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(80, 112, 221, 0.1)",
                },
              ],
            },
          },
        },
      ],
    }

    chart.setOption(option)

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.dispose()
    }
  }, [theme, data])

  // 如果没有数据，显示暂无数据状态
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            温度趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无数据</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          温度趋势
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[300px] max-w-full" />
      </CardContent>
    </Card>
  )
}

interface DailyForecastPageProps {
  data?: DailyWeatherResponse | null
  location?: string
}

export function DailyForecastPage({ data: initialData, location }: DailyForecastPageProps) {
  const [selectedDays, setSelectedDays] = useState<3 | 7 | 10 | 15 | 30>(7)
  const [currentPage, setCurrentPage] = useState(0)
  
  // 使用Hook获取不同天数的数据
  const { data: dynamicData, loading, error } = useDailyWeather(location, selectedDays)
  
  // 优先使用动态获取的数据，如果没有则使用传入的初始数据，最后才是空数组
  const dailyData = dynamicData?.daily || initialData?.daily || []
  
  const dayOptions: (3 | 7 | 10 | 15 | 30)[] = [3, 7, 10, 15, 30]
  const itemsPerPage = 3 // 每页显示3天
  const pageCount = Math.ceil(dailyData.length / itemsPerPage)
  
  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }
  
  const handleNext = () => {
    setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))
  }
  
  // 重置currentPage当selectedDays改变时
  useEffect(() => {
    setCurrentPage(0)
  }, [selectedDays])

  // 如果没有location且没有初始数据，显示提示信息
  if (!location && !initialData) {
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
                disabled
              >
                {days}天
              </Button>
            ))}
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">请选择城市以查看天气预报</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 显示错误状态
  if (error) {
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
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-8">
            <p className="text-red-700 mb-2">获取天气数据失败</p>
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              disabled={loading}
            >
              {days}天
            </Button>
          ))}
        </div>
      </div>

      {/* Temperature Trend Chart */}
      {loading && dailyData.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              温度趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-8 h-8 mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground">正在加载{selectedDays}天天气数据...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TemperatureTrendChart data={dailyData} />
      )}

      {/* Daily Cards Horizontal Slider */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">每日详情</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage >= pageCount - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentPage * (100 / pageCount)}%)`,
              width: `${pageCount * 100}%`
            }}
          >
            {Array.from({ length: pageCount }).map((_, pageIndex) => (
              <div 
                key={pageIndex}
                className="flex gap-4 flex-shrink-0"
                style={{ width: `${100 / pageCount}%` }}
              >
                {dailyData.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((day, dayIndex) => {
                  const date = new Date(day.fxDate)
                  const dayOfWeek = date.toLocaleDateString('zh-CN', { weekday: 'short' })
                  const dateStr = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                  
                  return (
                   <Card key={pageIndex * itemsPerPage + dayIndex} className="relative overflow-hidden flex-1">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{dayOfWeek}</div>
                    <div className="text-sm text-muted-foreground">{dateStr}</div>
                  </div>
                  <WeatherIcon condition={day.textDay} className="w-10 h-10" />
                </div>

                {/* 温度范围条 */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{day.tempMin}°</span>
                    <span className="text-sm font-medium">{day.tempMax}°</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-red-400 absolute" 
                      style={{ 
                        left: `${Math.max(0, (parseInt(day.tempMin) + 10) / 50 * 100)}%`,
                        width: `${Math.min(100, (parseInt(day.tempMax) - parseInt(day.tempMin)) / 50 * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Sunrise className="w-4 h-4" />
                      <span>日出: {day.sunrise || '--'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Sunset className="w-4 h-4" />
                      <span>日落: {day.sunset || '--'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Sun className="w-4 h-4" />
                      <span>紫外线: {day.uvIndex || '--'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Droplets className="w-4 h-4" />
                      <span>湿度: {day.humidity || '--'}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <Wind className="w-4 h-4" />
                    <span>风速: {day.windSpeedDay || '--'}km/h</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M2 12h5"></path>
                      <path d="M17 12h5"></path>
                      <path d="M7 12a5 5 0 0 1 5-5"></path>
                      <path d="M12 7v10"></path>
                      <path d="M12 17a5 5 0 0 0 5-5"></path>
                    </svg>
                    <span>能见度: {day.vis || '--'}km</span>
                  </div>
                </div>
              </CardContent>
                   </Card>
                   )
                 })}
               </div>
             ))}
           </div>
         </div>
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
              <LineChart data={dailyData.filter((d) => parseFloat(d.precip || '0') > 0)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="precip" stroke="hsl(var(--primary))" strokeWidth={2} />
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
