"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cloud, Clock, Calendar, MapPin, ChevronRight, ChevronDown, Home } from "lucide-react"

interface WeatherNavSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeView: string
  onViewChange: (view: string) => void
}

export function WeatherNavSidebar({ isOpen, onClose, activeView, onViewChange }: WeatherNavSidebarProps) {
  const [forecastExpanded, setForecastExpanded] = useState(true)

  const navItems = [
    {
      id: "overview",
      label: "天气概览",
      icon: Home,
      isParent: false,
    },
    {
      id: "forecast",
      label: "天气预报",
      icon: Cloud,
      isParent: true,
      children: [
        { id: "hourly", label: "逐小时预报", icon: Clock },
        { id: "daily", label: "每日预报", icon: Calendar },
        { id: "grid", label: "格点天气", icon: MapPin },
      ],
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />

      {/* Sidebar content */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border overflow-y-auto lg:relative lg:top-0 lg:h-full">
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground">导航</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              ✕
            </Button>
          </div>

          {navItems.map((item) => (
            <div key={item.id}>
              {item.isParent ? (
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => setForecastExpanded(!forecastExpanded)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {forecastExpanded ? (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </Button>
                  {forecastExpanded && item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.id}
                          variant={activeView === child.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm"
                          onClick={() => {
                            onViewChange(child.id)
                            onClose()
                          }}
                        >
                          <child.icon className="w-4 h-4 mr-2" />
                          {child.label}
                          {activeView === child.id && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              当前
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    onViewChange(item.id)
                    onClose()
                  }}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {activeView === item.id && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      当前
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
