// 演示环境设置
'use client';

import ApiService from './index';

/**
 * 初始化演示环境
 * 在实际项目中，这些配置应该从环境变量或配置文件中读取
 */
export function initializeDemoEnvironment() {
  // 根据用户反馈，API是可用的，可能不需要认证token
  // 先尝试不设置token，如果需要的话用户会提供
  const demoToken = process.env.NEXT_PUBLIC_WEATHER_API_TOKEN;
  
  if (demoToken) {
    try {
      ApiService.setAuthToken(demoToken);
      console.log('✅ API认证已初始化');
    } catch (error) {
      console.warn('⚠️ API认证初始化失败:', error);
    }
  } else {
    console.log('ℹ️ 未设置API token，尝试无认证访问');
  }
}

/**
 * 检查API服务状态
 */
export async function checkApiStatus() {
  try {
    const healthCheck = await ApiService.healthCheck();
    console.log('✅ API服务状态正常:', healthCheck);
    return true;
  } catch (error) {
    console.warn('⚠️ API服务连接失败:', error);
    return false;
  }
}

/**
 * 获取API信息
 */
export async function getApiInfo() {
  try {
    const apiInfo = await ApiService.getApiInfo();
    console.log('📋 API信息:', apiInfo);
    return apiInfo;
  } catch (error) {
    console.warn('⚠️ 获取API信息失败:', error);
    return null;
  }
}

/**
 * 演示数据获取
 * 当API不可用时，返回模拟数据
 */
export function getDemoData() {
  return {
    currentWeather: {
      code: '200',
      updateTime: new Date().toISOString(),
      now: {
        obsTime: new Date().toISOString(),
        temp: '8',
        feelsLike: '10',
        icon: '101',
        text: '多云',
        wind360: '180',
        windDir: '南风',
        windScale: '3',
        windSpeed: '15',
        humidity: '65',
        precip: '0.0',
        pressure: '1013',
        vis: '10',
        cloud: '40',
        dew: '2'
      }
    },
    hourlyWeather24h: {
      code: '200',
      updateTime: new Date().toISOString(),
      hourly: Array.from({ length: 24 }, (_, i) => ({
        fxTime: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
        temp: String(Math.round(8 + Math.sin(i / 4) * 5)),
        icon: i % 3 === 0 ? '100' : i % 2 === 0 ? '101' : '104',
        text: i % 3 === 0 ? '晴' : i % 2 === 0 ? '多云' : '阴',
        wind360: '180',
        windDir: '南风',
        windScale: '1-2',
        windSpeed: String(Math.round(10 + Math.random() * 10)),
        humidity: String(Math.round(50 + Math.random() * 30)),
        pop: '0',
        precip: '0.0',
        pressure: '1013',
        cloud: String(Math.round(Math.random() * 100)),
        dew: String(Math.round(Math.random() * 10))
      }))
    },
    dailyWeather7d: {
      code: '200',
      updateTime: new Date().toISOString(),
      daily: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          fxDate: date.toISOString().split('T')[0],
          sunrise: '07:30',
          sunset: '17:45',
          moonrise: '15:16',
          moonset: '03:40',
          moonPhase: '盈凸月',
          moonPhaseIcon: '803',
          tempMax: String(Math.round(15 + Math.sin(i / 7) * 8)),
          tempMin: String(Math.round(5 + Math.sin(i / 7) * 5)),
          iconDay: i % 4 === 0 ? '100' : i % 3 === 0 ? '101' : '104',
          textDay: i % 4 === 0 ? '晴' : i % 3 === 0 ? '多云' : '阴',
          iconNight: '150',
          textNight: '晴',
          wind360Day: '45',
          windDirDay: '东北风',
          windScaleDay: '1-2',
          windSpeedDay: '3',
          wind360Night: '0',
          windDirNight: '北风',
          windScaleNight: '1-2',
          windSpeedNight: '3',
          humidity: '65',
          precip: '0.0',
          pressure: '1020',
          vis: '25',
          cloud: '4',
          uvIndex: '3'
        };
      })
    },
    currentAirQuality: null,
    lifeIndices: null,
    // 移除默认location，避免自动请求北京数据
    updateTime: new Date().toISOString()
  };
}