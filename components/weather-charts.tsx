"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { useTheme } from "next-themes"
import { TrendingUp, BarChart3 } from "lucide-react"

// TODO: 替换为真实的天气图表数据API调用
// 当前使用虚拟数据，需要集成真实的天气数据服务
const temperatureData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  temperature: Math.round(8 + Math.sin(i / 4) * 5),
  humidity: Math.round(60 + Math.random() * 20),
}))

const weeklyData = [
  { day: "周一", maxTemp: 12, minTemp: 2, precipitation: 0 },
  { day: "周二", maxTemp: 15, minTemp: 5, precipitation: 2 },
  { day: "周三", maxTemp: 18, minTemp: 8, precipitation: 0 },
  { day: "周四", maxTemp: 16, minTemp: 6, precipitation: 5 },
  { day: "周五", maxTemp: 14, minTemp: 4, precipitation: 1 },
  { day: "周六", maxTemp: 17, minTemp: 7, precipitation: 0 },
  { day: "周日", maxTemp: 19, minTemp: 9, precipitation: 0 },
]

function TemperatureTrendChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartRef.current) return

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
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: temperatureData.map((item) => item.time),
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
          data: temperatureData.map((item) => item.temperature),
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
  }, [theme])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          温度趋势
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[300px]" />
      </CardContent>
    </Card>
  )
}

function WeeklyForecastChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartRef.current) return

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
      legend: {
        data: ["最高温度", "最低温度", "降水量"],
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
        data: weeklyData.map((item) => item.day),
        axisLine: {
          lineStyle: {
            color: isDark ? "#444" : "#ccc",
          },
        },
        axisLabel: {
          color: isDark ? "#ccc" : "#666",
        },
      },
      yAxis: [
         {
           type: "value",
           name: "温度 (°C)",
           position: "left",
           min: -5,
           max: 25,
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
         {
           type: "value",
           name: "降水量 (mm)",
           position: "right",
           min: 0,
           max: 10,
           axisLine: {
             lineStyle: {
               color: "#b6d634",
             },
           },
           axisLabel: {
             color: isDark ? "#ccc" : "#666",
             formatter: "{value}mm",
           },
         },
       ],
      series: [
        {
          name: "最高温度",
          type: "line",
          data: weeklyData.map((item) => item.maxTemp),
          lineStyle: {
            color: "#ff6b6b",
            width: 3,
          },
          itemStyle: {
            color: "#ff6b6b",
          },
        },
        {
          name: "最低温度",
          type: "line",
          data: weeklyData.map((item) => item.minTemp),
          lineStyle: {
            color: "#4ecdc4",
            width: 3,
          },
          itemStyle: {
            color: "#4ecdc4",
          },
        },
        {
          name: "降水量",
          type: "bar",
          yAxisIndex: 1,
          data: weeklyData.map((item) => item.precipitation),
          itemStyle: {
            color: "#b6d634",
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
  }, [theme])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          一周天气预报
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[300px]" />
      </CardContent>
    </Card>
  )
}

export function WeatherCharts() {
  return (
    <div className="space-y-6">
      <TemperatureTrendChart />
      <WeeklyForecastChart />
    </div>
  )
}
