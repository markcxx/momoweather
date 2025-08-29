// Next.js API代理路由，解决CORS问题
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.momoweather.markqq.com';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    // 构建目标URL
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;
    
    console.log('代理请求:', targetUrl);
    
    // 发起请求到真实API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MomoWeather-Frontend/1.0',
      },
    });
    
    if (!response.ok) {
      console.error('API请求失败:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'API请求失败', status: response.status },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // 返回数据，自动包含CORS头
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('代理请求错误:', error);
    return NextResponse.json(
      { error: '代理请求失败', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// 处理OPTIONS预检请求
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}