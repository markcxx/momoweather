// 天气数据管理Hook
'use client';

import { useState, useEffect, useCallback } from 'react';
import ApiService from '@/lib/api';
import { getDemoData } from '@/lib/api/demo-setup';
import type {
  CurrentWeatherResponse,
  HourlyWeatherResponse,
  DailyWeatherResponse,
  CurrentAirQualityResponse,
  WeatherIndicesResponse,
} from '@/lib/api';

// 首页数据类型
interface HomePageData {
  currentWeather: CurrentWeatherResponse;
  hourlyWeather24h: HourlyWeatherResponse | null;
  dailyWeather7d: DailyWeatherResponse;
  currentAirQuality: CurrentAirQualityResponse | null;
  lifeIndices: WeatherIndicesResponse | null;
  location: string;
  updateTime: string;
}

// Hook状态类型
interface WeatherDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Hook返回类型
interface UseWeatherDataReturn<T> extends WeatherDataState<T> {
  refetch: () => Promise<void>;
  clearError: () => void;
}

/**
 * 通用天气数据Hook
 * @param fetchFunction 数据获取函数
 * @param dependencies 依赖项数组
 * @param options 配置选项
 */
function useWeatherData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    cacheTime?: number;
  } = {}
): UseWeatherDataReturn<T> {
  const { immediate = true, cacheTime = 5 * 60 * 1000 } = options; // 默认缓存5分钟
  
  const [state, setState] = useState<WeatherDataState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => {
      // 检查缓存是否有效
      if (prev.lastUpdated && cacheTime > 0) {
        const timeSinceUpdate = Date.now() - prev.lastUpdated.getTime();
        if (timeSinceUpdate < cacheTime && prev.data) {
          return prev; // 使用缓存数据
        }
      }
      return { ...prev, loading: true, error: null };
    });
    
    try {
      const data = await fetchFunction();
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取数据失败';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [fetchFunction, cacheTime]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, ...dependencies]);

  // 当依赖项变化时，清除缓存
  useEffect(() => {
    setState(prev => ({ ...prev, lastUpdated: null }));
  }, [...dependencies]);

  return {
    ...state,
    refetch: fetchData,
    clearError,
  };
}

/**
 * 首页数据Hook
 * @param location 位置参数
 */
export function useHomePageData(location?: string) {
  return useWeatherData<HomePageData>(
    async () => {
      if (!location || location.trim() === '') {
        throw new Error('位置信息为空，无法获取天气数据');
      }
      const data = await ApiService.getHomePageData(location);
      // 确保返回的数据类型符合 HomePageData 接口定义
      return {
        currentWeather: data.currentWeather,
        hourlyWeather24h: data.hourlyWeather24h as HourlyWeatherResponse | null,
        dailyWeather7d: data.dailyWeather7d,
        currentAirQuality: data.currentAirQuality,
        lifeIndices: data.lifeIndices,
        location: data.location,
        updateTime: data.updateTime
      } as HomePageData;
    },
    [location],
    { 
      cacheTime: 5 * 60 * 1000, // 5分钟缓存
      immediate: !!(location && location.trim()) // 只有location有效时才立即请求
    }
  );
}

/**
 * 实时天气Hook
 * @param location 位置参数
 */
export function useCurrentWeather(location?: string) {
  return useWeatherData<CurrentWeatherResponse>(
    () => {
      if (!location || location.trim() === '') {
        throw new Error('位置参数不能为空');
      }
      return ApiService.weather.getCurrentWeather(location);
    },
    [location],
    { 
      cacheTime: 10 * 60 * 1000, // 10分钟缓存
      immediate: !!(location && location.trim()) // 只有location有效时才立即请求
    }
  );
}

/**
 * 24小时预报Hook
 * @param location 位置参数
 */
export function useHourlyWeather24h(location?: string) {
  return useWeatherData<HourlyWeatherResponse>(
    () => {
      if (!location || location.trim() === '') {
        throw new Error('位置参数不能为空');
      }
      return ApiService.weather.getHourlyWeather24h(location);
    },
    [location],
    { 
      cacheTime: 30 * 60 * 1000, // 30分钟缓存
      immediate: !!(location && location.trim()) // 只有location有效时才立即请求
    }
  );
}

/**
 * 每日预报Hook
 * @param location 位置参数
 * @param days 预报天数
 */
export function useDailyWeather(location?: string, days: 3 | 7 | 10 | 15 | 30 = 7) {
  return useWeatherData<DailyWeatherResponse>(
    () => {
      if (!location || location.trim() === '') {
        throw new Error('位置参数不能为空');
      }
      return ApiService.weather.getDailyWeatherByDays(days, location);
    },
    [location, days],
    { 
      cacheTime: 5 * 60 * 1000, // 5分钟缓存，减少缓存时间确保数据及时更新
      immediate: !!(location && location.trim()) // 只有location有效时才立即请求
    }
  );
}

/**
 * 空气质量Hook
 * @param location 位置参数
 */
export function useAirQuality(location?: string) {
  return useWeatherData<CurrentAirQualityResponse>(
    () => ApiService.airQuality.getCurrentAirQuality(location),
    [location],
    { cacheTime: 30 * 60 * 1000 } // 30分钟缓存
  );
}

/**
 * 生活指数Hook
 * @param location 位置参数
 * @param days 预报天数
 */
export function useLifeIndices(location?: string, days: 1 | 3 = 1) {
  return useWeatherData<WeatherIndicesResponse>(
    () => ApiService.indices.getLifeIndices(location, days),
    [location, days],
    { cacheTime: 2 * 60 * 60 * 1000 } // 2小时缓存
  );
}

/**
 * 城市搜索Hook
 */
export function useCitySearch() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCity = useCallback(async (cityName: string) => {
    if (!cityName.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await ApiService.geo.searchCity(cityName, { number: 10 });
      setSearchResults(result.location || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索失败';
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchCity,
    clearResults,
  };
}

/**
 * 多数据源Hook - 用于需要同时获取多种数据的场景
 */
export function useMultiWeatherData(location?: string) {
  const currentWeather = useCurrentWeather(location);
  const hourlyWeather = useHourlyWeather24h(location);
  const dailyWeather = useDailyWeather(location, 7);
  const airQuality = useAirQuality(location);
  const lifeIndices = useLifeIndices(location, 1);

  const loading = currentWeather.loading || hourlyWeather.loading || dailyWeather.loading;
  const error = currentWeather.error || hourlyWeather.error || dailyWeather.error;
  
  const refetchAll = useCallback(async () => {
    await Promise.all([
      currentWeather.refetch(),
      hourlyWeather.refetch(),
      dailyWeather.refetch(),
      airQuality.refetch(),
      lifeIndices.refetch(),
    ]);
  }, [
    currentWeather.refetch,
    hourlyWeather.refetch,
    dailyWeather.refetch,
    airQuality.refetch,
    lifeIndices.refetch,
  ]);

  return {
    currentWeather: currentWeather.data,
    hourlyWeather: hourlyWeather.data,
    dailyWeather: dailyWeather.data,
    airQuality: airQuality.data,
    lifeIndices: lifeIndices.data,
    loading,
    error,
    refetchAll,
  };
}

/**
 * 数据刷新Hook - 提供统一的数据刷新功能
 */
export function useDataRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  const refresh = useCallback(async (refreshFunctions: (() => Promise<void>)[]) => {
    setIsRefreshing(true);
    
    try {
      await Promise.all(refreshFunctions.map(fn => fn()));
      setLastRefreshTime(new Date());
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    isRefreshing,
    lastRefreshTime,
    refresh,
  };
}