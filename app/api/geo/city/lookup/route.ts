import { NextRequest, NextResponse } from 'next/server'

/**
 * 城市搜索API代理
 * 代理到 https://api.momoweather.markqq.com/geo/city/lookup
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 构建目标URL
    const targetUrl = new URL('https://api.momoweather.markqq.com/geo/city/lookup')
    
    // 复制所有查询参数
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value)
    })
    
    console.log('代理请求:', targetUrl.toString())
    
    // 发起请求到真实API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MomoWeather/1.0',
      },
    })
    
    if (!response.ok) {
      console.error('API请求失败:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'API请求失败', status: response.status },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    // 返回数据
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('代理请求错误:', error)
    return NextResponse.json(
      { error: '代理请求失败', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}