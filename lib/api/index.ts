// API服务统一入口

// 导出配置
export { API_CONFIG, STATUS_CODES, INDICES_TYPES } from './config';

// 导出类型定义
export type {
  BaseResponse,
  CurrentWeatherResponse,
  HourlyWeatherResponse,
  HourlyWeatherItem,
  DailyWeatherResponse,
  DailyWeatherItem,
  CurrentAirQualityResponse,
  AirQualityIndex,
  Pollutant,
  AirQualityStation,
  WeatherIndicesResponse,
  WeatherIndexItem,
  CitySearchResponse,
  CityInfo,
  POISearchResponse,
  POIInfo,
  ApiError,
  WeatherRequestParams,
  IndicesRequestParams,
  CitySearchParams,
  POISearchParams,
  POIRangeParams,
} from './types';

// 导出HTTP客户端
export { HttpClient, httpClient, api } from './http-client';

// 导入服务类
import { WeatherService } from './weather-service';
import { AirQualityService } from './air-quality-service';
import { IndicesService } from './indices-service';
import { GeoService } from './geo-service';
import { api } from './http-client';
import { API_CONFIG } from './config';

// 导出服务类
export { WeatherService } from './weather-service';
export { AirQualityService } from './air-quality-service';
export type { DailyAirQualityResponse, HourlyAirQualityResponse } from './air-quality-service';
export { IndicesService } from './indices-service';
export { GeoService } from './geo-service';

// 创建统一的API服务类
export class ApiService {
  // 天气服务
  static weather = WeatherService;
  
  // 空气质量服务
  static airQuality = AirQualityService;
  
  // 天气指数服务
  static indices = IndicesService;
  
  // 地理位置服务
  static geo = GeoService;
  
  /**
   * 设置认证token
   * @param token JWT token
   */
  static setAuthToken(token: string) {
    api.setAuthToken(token);
  }
  
  /**
   * 移除认证token
   */
  static removeAuthToken() {
    api.removeAuthToken();
  }
  
  /**
   * 获取首页所需的所有数据
   * @param location 位置参数（必需）
   * @returns 首页数据对象
   */
  static async getHomePageData(location: string) {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    
    try {
      // 优先获取核心天气数据
      const [
        currentWeather,
        dailyWeather7d,
      ] = await Promise.all([
        // 实时天气
        WeatherService.getCurrentWeather(location),
        // 7天预报
        WeatherService.getDailyWeather7d(location),
      ]);
      
      // 然后获取次要数据
      const [
        hourlyWeather24h,
        currentAirQuality,
        lifeIndices,
      ] = await Promise.allSettled([
        // 24小时预报
        WeatherService.getHourlyWeather24h(location),
        // 实时空气质量
        AirQualityService.getCurrentAirQuality(location),
        // 生活指数
        IndicesService.getLifeIndices(location, 1),
      ]).then(results => [
        results[0].status === 'fulfilled' ? results[0].value : null,
        results[1].status === 'fulfilled' ? results[1].value : null,
        results[2].status === 'fulfilled' ? results[2].value : null,
      ]);
      
      return {
        currentWeather,
        hourlyWeather24h,
        dailyWeather7d,
        currentAirQuality,
        lifeIndices,
        location,
        updateTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to fetch home page data:', error);
      throw error;
    }
  }
  
  /**
   * 获取详细天气数据（用于详情页）
   * @param location 位置参数
   * @param days 预报天数
   * @returns 详细天气数据
   */
  static async getDetailedWeatherData(
    location: string,
    days: 7 | 15 | 30 = 7
  ) {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    
    try {
      const [dailyWeather, hourlyWeather72h, allIndices] = await Promise.all([
        // 多天预报
        WeatherService.getDailyWeatherByDays(days as 7 | 15 | 30, location),
        // 72小时预报
        WeatherService.getHourlyWeather72h(location),
        // 所有生活指数
        IndicesService.getAllIndices(location, 3).catch(() => null),
      ]);
      
      return {
        dailyWeather,
        hourlyWeather72h,
        allIndices,
        location,
        days,
        updateTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to fetch detailed weather data:', error);
      throw error;
    }
  }
  
  /**
   * 搜索城市并获取天气数据
   * @param cityName 城市名称
   * @returns 城市信息和天气数据
   */
  static async searchCityWeather(cityName: string) {
    try {
      // 先搜索城市
      const cityResult = await GeoService.searchCity(cityName, { number: 1 });
      
      if (!cityResult.location || cityResult.location.length === 0) {
        throw new Error(`未找到城市: ${cityName}`);
      }
      
      const city = cityResult.location[0];
      const location = city.id;
      
      // 获取该城市的天气数据
      const weatherData = await this.getHomePageData(location);
      
      return {
        city,
        ...weatherData,
      };
    } catch (error) {
      console.error('Failed to search city weather:', error);
      throw error;
    }
  }
  
  /**
   * 健康检查
   * @returns 服务状态
   */
  static async healthCheck() {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
  
  /**
   * 获取API信息
   * @returns API信息
   */
  static async getApiInfo() {
    try {
      const response = await api.get('/');
      return response;
    } catch (error) {
      console.error('Failed to get API info:', error);
      throw error;
    }
  }
}

// 默认导出统一服务
export default ApiService;