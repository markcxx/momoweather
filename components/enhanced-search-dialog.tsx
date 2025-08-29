"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Loader2 } from "lucide-react"
import { CitySearchService } from "@/lib/services/city-search"
import { CityData } from "@/lib/data/city-data"

interface EnhancedSearchDialogProps {
  onLocationSelect: (city: CityData) => void
}

export function EnhancedSearchDialog({ onLocationSelect }: EnhancedSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<CityData[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<CityData[]>([])
  const [popularCities, setPopularCities] = useState<CityData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const searchService = useMemo(() => CitySearchService.getInstance(), [])
  
  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      setIsInitializing(true)
      try {
        // 加载热门城市
        const popular = await searchService.getPopularCities()
        setPopularCities(popular)
        
        // 加载历史搜索记录
        const saved = localStorage.getItem('recent-city-searches')
        if (saved) {
          try {
            setRecentSearches(JSON.parse(saved))
          } catch (e) {
            // 解析历史搜索失败
          }
        }
      } catch (error) {
        // 初始化搜索数据失败
      } finally {
        setIsInitializing(false)
      }
    }
    
    initializeData()
  }, [])
  
  // 实时搜索
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSelectedIndex(-1)
      return
    }
    
    setIsLoading(true)
    
    // 防抖处理
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchService.search(query, 8)
        setResults(searchResults)
        setSelectedIndex(-1)
      } catch (error) {
        // 搜索失败
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 150)
    
    return () => {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }, [query, searchService])
  
  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev <= 0 ? results.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleCitySelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setOpen(false)
        break
    }
  }
  
  const handleCitySelect = (city: CityData) => {
    // 保存到历史记录
    const newRecentSearches = [city, ...recentSearches.filter(item => item.code !== city.code)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recent-city-searches', JSON.stringify(newRecentSearches))
    
    // 回调选择结果
    onLocationSelect(city)
    
    // 关闭对话框
    setOpen(false)
    setQuery("")
    setResults([])
  }
  
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">{part}</mark> : 
        part
    )
  }
  
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'province': return { text: '省', variant: 'secondary' as const }
      case 'city': return { text: '市', variant: 'default' as const }
      case 'county': return { text: '区/县', variant: 'outline' as const }
      default: return { text: '其他', variant: 'secondary' as const }
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="w-4 h-4" />
          搜索城市
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>搜索城市</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="输入城市名称或拼音..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
              autoFocus
              disabled={isInitializing}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 overflow-hidden">
            {isInitializing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-muted-foreground">初始化搜索数据...</span>
              </div>
            ) : (
              <>
                {/* 搜索结果 */}
                {query && (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {results.length > 0 ? (
                      results.map((city, index) => {
                        const badge = getLevelBadge(city.level)
                        return (
                          <div
                            key={city.code}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                              index === selectedIndex 
                                ? 'bg-primary text-primary-foreground shadow-md' 
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleCitySelect(city)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium truncate">
                                  {highlightMatch(city.fullName, query)}
                                </span>
                              </div>
                              <Badge variant={badge.variant} className="text-xs ml-2 flex-shrink-0">
                                {badge.text}
                              </Badge>
                            </div>
                            <div className="text-sm opacity-75 mt-1 ml-6">
                              拼音: {city.pinyin} | 简拼: {city.pinyinShort}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {isLoading ? '搜索中...' : '未找到匹配的城市'}
                      </div>
                    )}
                  </div>
                )}
                
                {/* 历史搜索 */}
                {!query && recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>最近搜索</span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {recentSearches.map((city) => {
                        const badge = getLevelBadge(city.level)
                        return (
                          <div
                            key={city.code}
                            className="p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleCitySelect(city)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{city.fullName}</span>
                              </div>
                              <Badge variant={badge.variant} className="text-xs ml-2 flex-shrink-0">
                                {badge.text}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {/* 热门城市 */}
                {!query && popularCities.length > 0 && (
                  <div className={`space-y-3 ${recentSearches.length > 0 ? 'mt-6' : ''}`}>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>热门城市</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {popularCities.map((city) => (
                        <Button
                          key={city.code}
                          variant="outline"
                          size="sm"
                          className="justify-start h-auto p-2 text-left"
                          onClick={() => handleCitySelect(city)}
                        >
                          <span className="truncate">{city.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}