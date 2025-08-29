"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Sun, Cloud } from "lucide-react"
import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { useTheme } from "next-themes"
import type { HourlyWeatherResponse } from "@/lib/api"

interface HourlyForecastChartProps {
  data?: HourlyWeatherResponse | null
}

export function HourlyForecastChart({ data }: HourlyForecastChartProps) {
  // 如果没有数据，显示占位符
  if (!data || !data.hourly || data.hourly.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              24小时预报
            </span>
            <Badge variant="secondary">暂无数据</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">24小时预报数据暂不可用</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // 处理数据，取前24小时
  const hourlyData = data.hourly.slice(0, 24).map(item => ({
    time: new Date(item.fxTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    temperature: parseInt(item.temp),
    humidity: parseInt(item.humidity),
    condition: item.text,
  }))
  const chartRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    const isDark = theme === "dark"
    const colors = ["#5070dd", "#b6d634", "#505372"]

    const option = {
      color: colors,
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
        borderColor: isDark ? "#333" : "#ccc",
        textStyle: {
          color: isDark ? "#fff" : "#333",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: hourlyData.map((item) => item.time),
        axisLine: {
          lineStyle: {
            color: isDark ? "#444" : "#ccc",
          },
        },
        axisLabel: {
          color: isDark ? "#ccc" : "#666",
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
      series: [
        {
          data: hourlyData.map((item) => item.temperature),
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#5070dd",
            width: 3,
          },
          itemStyle: {
            color: "#5070dd",
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
  }, [theme, hourlyData])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            未来24小时预报
          </span>
          <Badge>24小时</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hourly Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-primary mb-1">
              {Math.max(...hourlyData.map(h => h.temperature))}° / {Math.min(...hourlyData.map(h => h.temperature))}°
            </div>
            <p className="text-sm text-muted-foreground">温度范围</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary mb-1">
              {Math.round(hourlyData.reduce((sum, h) => sum + h.humidity, 0) / hourlyData.length)}%
            </div>
            <p className="text-sm text-muted-foreground">平均湿度</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary mb-1">
              {hourlyData[0]?.condition || '--'}
            </div>
            <p className="text-sm text-muted-foreground">当前天气</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary mb-1">
              {hourlyData.length}
            </div>
            <p className="text-sm text-muted-foreground">小时数据</p>
          </div>
        </div>

        {/* Chart */}
        <div ref={chartRef} className="w-full h-[400px]" />
      </CardContent>
    </Card>
  )
}