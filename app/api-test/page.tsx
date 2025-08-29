'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApiService from '@/lib/api';

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testCurrentWeather = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('开始测试实时天气API...');
      // 移除硬编码的北京LocationID，改为动态获取
        const data = await ApiService.weather.getCurrentWeather();
      console.log('API响应:', data);
      setResult(data);
    } catch (err: any) {
      console.error('API请求失败:', err);
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('开始测试健康检查API...');
      const data = await ApiService.healthCheck();
      console.log('健康检查响应:', data);
      setResult(data);
    } catch (err: any) {
      console.error('健康检查失败:', err);
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  const testApiInfo = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('开始测试API信息...');
      const data = await ApiService.getApiInfo();
      console.log('API信息响应:', data);
      setResult(data);
    } catch (err: any) {
      console.error('API信息请求失败:', err);
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API测试页面</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testHealthCheck} disabled={loading}>
              {loading ? '测试中...' : '测试健康检查'}
            </Button>
            <Button onClick={testApiInfo} disabled={loading}>
              {loading ? '测试中...' : '测试API信息'}
            </Button>
            <Button onClick={testCurrentWeather} disabled={loading}>
              {loading ? '测试中...' : '测试实时天气'}
            </Button>
          </div>
          
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-red-700 mb-2">错误信息:</h3>
                <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
              </CardContent>
            </Card>
          )}
          
          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-700 mb-2">响应结果:</h3>
                <pre className="text-sm text-green-600 whitespace-pre-wrap overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}