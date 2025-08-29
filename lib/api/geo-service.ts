// 地理位置服务API类
import { api } from './http-client';
import { API_CONFIG } from './config';
import type {
  CitySearchResponse,
  POISearchResponse,
  CitySearchParams,
  POISearchParams,
  POIRangeParams,
} from './types';

/**
 * 地理位置服务类
 * 提供城市搜索、POI搜索等地理位置相关功能
 */
export class GeoService {
  /**
   * 城市搜索
   * @param location 城市名称或坐标
   * @param params 搜索参数
   * @returns 城市搜索结果
   */
  static async searchCity(
    location: string,
    params?: Omit<CitySearchParams, 'location'>
  ): Promise<CitySearchResponse> {
    const queryParams = {
      location,
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      number: 10, // 默认返回10个结果
      ...params,
    };

    return api.get<CitySearchResponse>('/geo/city/lookup', queryParams);
  }

  /**
   * 获取热门城市
   * @param range 搜索范围，国家代码（如：cn）
   * @param number 返回结果数量，默认10，最大20
   * @param lang 语言设置
   * @returns 热门城市列表
   */
  static async getTopCities(
    range?: string,
    number: number = 10,
    lang: string = API_CONFIG.DEFAULT_PARAMS.lang
  ): Promise<CitySearchResponse> {
    const queryParams = {
      range,
      number,
      lang,
    };

    return api.get<CitySearchResponse>('/geo/city/top', queryParams);
  }

  /**
   * POI搜索
   * @param location 搜索关键词
   * @param type POI类型
   * @param params 搜索参数
   * @returns POI搜索结果
   */
  static async searchPOI(
    location: string,
    type: 'scenic' | 'CSTA' | 'TSTA',
    params?: Omit<POISearchParams, 'location' | 'type'>
  ): Promise<POISearchResponse> {
    const queryParams = {
      location,
      type,
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      number: 10, // 默认返回10个结果
      ...params,
    };

    return api.get<POISearchResponse>('/geo/poi/lookup', queryParams);
  }

  /**
   * POI范围搜索
   * @param location 经纬度坐标（格式："经度,纬度"）
   * @param type POI类型
   * @param params 搜索参数
   * @returns POI搜索结果
   */
  static async searchPOIInRange(
    location: string,
    type: 'scenic' | 'CSTA' | 'TSTA',
    params?: Omit<POIRangeParams, 'location' | 'type'>
  ): Promise<POISearchResponse> {
    const queryParams = {
      location,
      type,
      radius: 5, // 默认搜索半径5公里
      number: 10, // 默认返回10个结果
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      ...params,
    };

    return api.get<POISearchResponse>('/geo/poi/range', queryParams);
  }

  /**
   * 获取LocationID
   * @param city 城市名称
   * @param adm 上级行政区划
   * @returns LocationID字符串
   */
  static async getLocationId(
    city: string,
    adm?: string
  ): Promise<string> {
    const queryParams = {
      city,
      adm,
    };

    return api.get<string>('/geo/location-id', queryParams);
  }

  /**
   * 搜索景点
   * @param keyword 搜索关键词
   * @param city 限定城市
   * @param number 返回结果数量
   * @returns 景点搜索结果
   */
  static async searchScenic(
    keyword: string,
    city?: string,
    number: number = 10
  ): Promise<POISearchResponse> {
    return this.searchPOI(keyword, 'scenic', { city, number });
  }

  /**
   * 搜索火车站
   * @param keyword 搜索关键词
   * @param city 限定城市
   * @param number 返回结果数量
   * @returns 火车站搜索结果
   */
  static async searchTrainStation(
    keyword: string,
    city?: string,
    number: number = 10
  ): Promise<POISearchResponse> {
    return this.searchPOI(keyword, 'TSTA', { city, number });
  }

  /**
   * 搜索汽车站
   * @param keyword 搜索关键词
   * @param city 限定城市
   * @param number 返回结果数量
   * @returns 汽车站搜索结果
   */
  static async searchCoachStation(
    keyword: string,
    city?: string,
    number: number = 10
  ): Promise<POISearchResponse> {
    return this.searchPOI(keyword, 'CSTA', { city, number });
  }

  /**
   * 根据经纬度搜索附近的景点
   * @param lat 纬度
   * @param lon 经度
   * @param radius 搜索半径（公里）
   * @param number 返回结果数量
   * @returns 附近景点列表
   */
  static async searchNearbyScenic(
    lat: number,
    lon: number,
    radius: number = 10,
    number: number = 10
  ): Promise<POISearchResponse> {
    const location = `${lon},${lat}`; // 经度在前，纬度在后
    return this.searchPOIInRange(location, 'scenic', { radius, number });
  }

  /**
   * 验证经纬度格式
   * @param location 经纬度字符串
   * @returns 是否为有效的经纬度格式
   */
  static isValidCoordinates(location: string): boolean {
    const coordPattern = /^-?\d+\.\d+,-?\d+\.\d+$/;
    if (!coordPattern.test(location)) {
      return false;
    }

    const [lonStr, latStr] = location.split(',');
    const lon = parseFloat(lonStr);
    const lat = parseFloat(latStr);

    // 检查经纬度范围
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
  }

  /**
   * 验证LocationID格式
   * @param locationId LocationID字符串
   * @returns 是否为有效的LocationID格式
   */
  static isValidLocationId(locationId: string): boolean {
    // LocationID通常是数字字符串，长度在8-12位之间
    const locationIdPattern = /^\d{8,12}$/;
    return locationIdPattern.test(locationId);
  }

  /**
   * 格式化经纬度
   * @param lat 纬度
   * @param lon 经度
   * @returns 格式化的经纬度字符串
   */
  static formatCoordinates(lat: number, lon: number): string {
    return `${lon.toFixed(6)},${lat.toFixed(6)}`;
  }

  /**
   * 解析经纬度字符串
   * @param location 经纬度字符串
   * @returns 经纬度对象
   */
  static parseCoordinates(location: string): { lat: number; lon: number } | null {
    if (!this.isValidCoordinates(location)) {
      return null;
    }

    const [lonStr, latStr] = location.split(',');
    return {
      lat: parseFloat(latStr),
      lon: parseFloat(lonStr),
    };
  }

  /**
   * 计算两点之间的距离（使用Haversine公式）
   * @param lat1 第一个点的纬度
   * @param lon1 第一个点的经度
   * @param lat2 第二个点的纬度
   * @param lon2 第二个点的经度
   * @returns 距离（公里）
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // 地球半径（公里）
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * 角度转弧度
   * @param degrees 角度
   * @returns 弧度
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * 获取中国热门城市
   * @param number 返回结果数量
   * @returns 中国热门城市列表
   */
  static async getChinaTopCities(number: number = 20): Promise<CitySearchResponse> {
    return this.getTopCities('cn', number);
  }

  /**
   * 搜索中国城市
   * @param cityName 城市名称
   * @param number 返回结果数量
   * @returns 城市搜索结果
   */
  static async searchChinaCity(
    cityName: string,
    number: number = 10
  ): Promise<CitySearchResponse> {
    return this.searchCity(cityName, { range: 'cn', number });
  }
}