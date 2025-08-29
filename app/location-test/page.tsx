"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"

interface LocationResult {
  status: number
  message: string
  result: {
    ip: string
    location: {
      lat: number
      lng: number
    }
    ad_info: {
      nation: string
      province: string
      city: string
      district: string
      adcode: string
    }
  }
}

export default function LocationTestPage() {
  const [locationData, setLocationData] = useState<LocationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testTencentLocationAPI = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 使用JSONP方式调用腾讯地图IP定位API
      const script = document.createElement('script')
      const callbackName = 'tencentLocationCallback' + Date.now()
      
      // 创建全局回调函数
      ;(window as any)[callbackName] = (data: LocationResult) => {
        setLocationData(data)
        setLoading(false)
        document.head.removeChild(script)
        delete (window as any)[callbackName]
      }
      
      // 设置超时处理
      setTimeout(() => {
        if (loading) {
          setError('请求超时，请检查网络连接')
          setLoading(false)
          if (document.head.contains(script)) {
            document.head.removeChild(script)
          }
          delete (window as any)[callbackName]
        }
      }, 10000)
      
      script.src = `https://apis.map.qq.com/ws/location/v1/ip?key=T3EBZ-TJ7LI-YRBG2-5ZLUR-KD3OS-U6BJO&output=jsonp&callback=${callbackName}`
      script.onerror = () => {
        setError('API请求失败，请检查网络连接或API密钥')
        setLoading(false)
      }
      
      document.head.appendChild(script)
      
    } catch (err) {
      setError('发生未知错误: ' + (err as Error).message)
      setLoading(false)
    }
  }

  const getDetailedAddress = () => {
    if (!locationData) return ''
    
    const { ad_info } = locationData.result
    
    if (ad_info.nation === '中国') {
      return `${ad_info.province} ${ad_info.city} ${ad_info.district}`
    }
    
    return ad_info.nation
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            腾讯地图IP定位API测试
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testTencentLocationAPI} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? '获取位置中...' : '测试获取位置'}
            </Button>
          </div>
          
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-700">❌ {error}</p>
              </CardContent>
            </Card>
          )}
          
          {locationData && (
            <div className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <p className="text-green-700">✅ API调用成功！</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">位置信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>IP地址:</strong> {locationData.result.ip}</p>
                      <p><strong>详细地址:</strong> {getDetailedAddress()}</p>
                      <p><strong>国家:</strong> {locationData.result.ad_info.nation}</p>
                      <p><strong>省份:</strong> {locationData.result.ad_info.province}</p>
                      <p><strong>城市:</strong> {locationData.result.ad_info.city}</p>
                      <p><strong>区县:</strong> {locationData.result.ad_info.district}</p>
                    </div>
                    <div>
                      <p><strong>经度:</strong> {locationData.result.location.lng}</p>
                      <p><strong>纬度:</strong> {locationData.result.location.lat}</p>
                      <p><strong>行政区划代码:</strong> {locationData.result.ad_info.adcode}</p>
                      <p><strong>状态码:</strong> {locationData.status}</p>
                      <p><strong>状态信息:</strong> {locationData.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">完整API响应</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(locationData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}