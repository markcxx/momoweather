// 天气服务API类
import { api } from './http-client';
import { API_CONFIG } from './config';
import type {
  CurrentWeatherResponse,
  HourlyWeatherResponse,
  DailyWeatherResponse,
  WeatherRequestParams,
} from './types';

/**
 * 天气服务类
 * 提供各种天气数据的获取功能
 */
export class WeatherService {
  /**
   * 获取实时天气数据
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 实时天气数据
   */
  static async getCurrentWeather(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<CurrentWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<CurrentWeatherResponse>(
      `/weather/now/${location}`,
      queryParams
    );
  }

  /**
   * 获取24小时天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 24小时天气预报数据
   */
  static async getHourlyWeather24h(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<HourlyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<HourlyWeatherResponse>(
      `/weather/hourly/24h/${location}`,
      queryParams
    );
  }

  /**
   * 获取72小时天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 72小时天气预报数据
   */
  static async getHourlyWeather72h(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<HourlyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<HourlyWeatherResponse>(
      `/weather/hourly/72h/${location}`,
      queryParams
    );
  }

  /**
   * 获取168小时天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 168小时天气预报数据
   */
  static async getHourlyWeather168h(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<HourlyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<HourlyWeatherResponse>(
      `/weather/hourly/168h/${location}`,
      queryParams
    );
  }

  /**
   * 获取3天每日天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 3天每日天气预报数据
   */
  static async getDailyWeather3d(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<DailyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<DailyWeatherResponse>(
      `/weather/daily/3d/${location}`,
      queryParams
    );
  }

  /**
   * 获取7天每日天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 7天每日天气预报数据
   */
  static async getDailyWeather7d(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<DailyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<DailyWeatherResponse>(
      `/weather/daily/7d/${location}`,
      queryParams
    );
  }

  /**
   * 获取10天每日天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 10天每日天气预报数据
   */
  static async getDailyWeather10d(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<DailyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<DailyWeatherResponse>(
      `/weather/daily/10d/${location}`,
      queryParams
    );
  }

  /**
   * 获取15天每日天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 15天每日天气预报数据
   */
  static async getDailyWeather15d(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<DailyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<DailyWeatherResponse>(
      `/weather/daily/15d/${location}`,
      queryParams
    );
  }

  /**
   * 获取30天每日天气预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 30天每日天气预报数据
   */
  static async getDailyWeather30d(
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<DailyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    return api.get<DailyWeatherResponse>(
      `/weather/daily/30d/${location}`,
      queryParams
    );
  }

  /**
   * 根据天数获取每日天气预报
   * @param days 天数（3, 7, 10, 15, 30）
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 每日天气预报数据
   */
  static async getDailyWeatherByDays(
    days: 3 | 7 | 10 | 15 | 30,
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<DailyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    switch (days) {
      case 3:
        return this.getDailyWeather3d(location, params);
      case 7:
        return this.getDailyWeather7d(location, params);
      case 10:
        return this.getDailyWeather10d(location, params);
      case 15:
        return this.getDailyWeather15d(location, params);
      case 30:
        return this.getDailyWeather30d(location, params);
      default:
        throw new Error(`Unsupported days: ${days}. Supported values: 3, 7, 10, 15, 30`);
    }
  }

  /**
   * 根据小时数获取小时天气预报
   * @param hours 小时数（24, 72, 168）
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 小时天气预报数据
   */
  static async getHourlyWeatherByHours(
    hours: 24 | 72 | 168,
    location: string,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<HourlyWeatherResponse> {
    if (!location || location.trim() === '') {
      throw new Error('位置参数不能为空');
    }
    switch (hours) {
      case 24:
        return this.getHourlyWeather24h(location, params);
      case 72:
        return this.getHourlyWeather72h(location, params);
      case 168:
        return this.getHourlyWeather168h(location, params);
      default:
        throw new Error(`Unsupported hours: ${hours}. Supported values: 24, 72, 168`);
    }
  }
}