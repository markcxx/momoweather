// 天气指数服务API类
import { api } from './http-client';
import { API_CONFIG, INDICES_TYPES } from './config';
import type {
  WeatherIndicesResponse,
  IndicesRequestParams,
} from './types';

/**
 * 天气指数服务类
 * 提供各种天气指数数据的获取功能
 */
export class IndicesService {
  /**
   * 获取1天天气指数预报
   * @param location 位置参数（LocationID或经纬度）
   * @param type 指数类型，多个类型用逗号分隔
   * @param params 可选参数
   * @returns 1天天气指数预报数据
   */
  static async getIndices1d(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    type: string,
    params?: Omit<IndicesRequestParams, 'location' | 'type'>
  ): Promise<WeatherIndicesResponse> {
    const queryParams = {
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      type,
      ...params,
    };

    return api.get<WeatherIndicesResponse>(
      `/indices/1d/${location}`,
      queryParams
    );
  }

  /**
   * 获取3天天气指数预报
   * @param location 位置参数（LocationID或经纬度）
   * @param type 指数类型，多个类型用逗号分隔
   * @param params 可选参数
   * @returns 3天天气指数预报数据
   */
  static async getIndices3d(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    type: string,
    params?: Omit<IndicesRequestParams, 'location' | 'type'>
  ): Promise<WeatherIndicesResponse> {
    const queryParams = {
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      type,
      ...params,
    };

    return api.get<WeatherIndicesResponse>(
      `/indices/3d/${location}`,
      queryParams
    );
  }

  /**
   * 获取运动指数
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 运动指数数据
   */
  static async getSportIndex(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    if (days === 1) {
      return this.getIndices1d(location, INDICES_TYPES.SPORT);
    } else {
      return this.getIndices3d(location, INDICES_TYPES.SPORT);
    }
  }

  /**
   * 获取洗车指数
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 洗车指数数据
   */
  static async getCarWashIndex(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    if (days === 1) {
      return this.getIndices1d(location, INDICES_TYPES.CAR_WASH);
    } else {
      return this.getIndices3d(location, INDICES_TYPES.CAR_WASH);
    }
  }

  /**
   * 获取穿衣指数
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 穿衣指数数据
   */
  static async getClothingIndex(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    if (days === 1) {
      return this.getIndices1d(location, INDICES_TYPES.CLOTHING);
    } else {
      return this.getIndices3d(location, INDICES_TYPES.CLOTHING);
    }
  }

  /**
   * 获取感冒指数
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 感冒指数数据
   */
  static async getColdIndex(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    if (days === 1) {
      return this.getIndices1d(location, INDICES_TYPES.COLD);
    } else {
      return this.getIndices3d(location, INDICES_TYPES.COLD);
    }
  }

  /**
   * 获取紫外线指数
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 紫外线指数数据
   */
  static async getUVIndex(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    if (days === 1) {
      return this.getIndices1d(location, INDICES_TYPES.UV);
    } else {
      return this.getIndices3d(location, INDICES_TYPES.UV);
    }
  }

  /**
   * 获取旅游指数
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 旅游指数数据
   */
  static async getTravelIndex(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    if (days === 1) {
      return this.getIndices1d(location, INDICES_TYPES.TRAVEL);
    } else {
      return this.getIndices3d(location, INDICES_TYPES.TRAVEL);
    }
  }

  /**
   * 获取生活指数（常用指数组合）
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 生活指数数据
   */
  static async getLifeIndices(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    // 获取常用的生活指数：穿衣、洗车、运动、旅游、紫外线、感冒
    const types = [
      INDICES_TYPES.CLOTHING,
      INDICES_TYPES.CAR_WASH,
      INDICES_TYPES.SPORT,
      INDICES_TYPES.TRAVEL,
      INDICES_TYPES.UV,
      INDICES_TYPES.COLD,
    ].join(',');

    if (days === 1) {
      return this.getIndices1d(location, types);
    } else {
      return this.getIndices3d(location, types);
    }
  }

  /**
   * 获取所有可用指数
   * @param location 位置参数
   * @param days 天数（1或3）
   * @returns 所有指数数据
   */
  static async getAllIndices(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    days: 1 | 3 = 1
  ): Promise<WeatherIndicesResponse> {
    // 获取所有指数类型
    const types = Object.values(INDICES_TYPES).join(',');

    if (days === 1) {
      return this.getIndices1d(location, types);
    } else {
      return this.getIndices3d(location, types);
    }
  }

  /**
   * 获取指数类型的中文名称
   * @param type 指数类型代码
   * @returns 中文名称
   */
  static getIndexTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      [INDICES_TYPES.SPORT]: '运动指数',
      [INDICES_TYPES.CAR_WASH]: '洗车指数',
      [INDICES_TYPES.CLOTHING]: '穿衣指数',
      [INDICES_TYPES.COLD]: '感冒指数',
      [INDICES_TYPES.UV]: '紫外线指数',
      [INDICES_TYPES.TRAVEL]: '旅游指数',
      [INDICES_TYPES.AIR_POLLUTION]: '空气污染扩散条件指数',
      [INDICES_TYPES.AC]: '空调开启指数',
      [INDICES_TYPES.ALLERGY]: '过敏指数',
      [INDICES_TYPES.SUNGLASSES]: '太阳镜指数',
      [INDICES_TYPES.MAKEUP]: '化妆指数',
      [INDICES_TYPES.DRYING]: '晾晒指数',
      [INDICES_TYPES.TRAFFIC]: '交通指数',
      [INDICES_TYPES.FISHING]: '钓鱼指数',
      [INDICES_TYPES.SUNSCREEN]: '防晒指数',
    };

    return typeNames[type] || `指数${type}`;
  }

  /**
   * 获取指数等级的颜色
   * @param level 指数等级
   * @returns 颜色值
   */
  static getIndexLevelColor(level: string): string {
    const levelColors: Record<string, string> = {
      '1': '#00e400',  // 绿色 - 优/适宜
      '2': '#ffff00',  // 黄色 - 良/较适宜
      '3': '#ff7e00',  // 橙色 - 一般/较不适宜
      '4': '#ff0000',  // 红色 - 差/不适宜
      '5': '#99004c',  // 紫色 - 很差/很不适宜
    };

    return levelColors[level] || '#999999';
  }

  /**
   * 获取指数等级的描述
   * @param level 指数等级
   * @param indexType 指数类型
   * @returns 等级描述
   */
  static getIndexLevelDescription(level: string, indexType?: string): string {
    // 通用等级描述
    const generalDescriptions: Record<string, string> = {
      '1': '适宜',
      '2': '较适宜',
      '3': '一般',
      '4': '较不适宜',
      '5': '不适宜',
    };

    // 特定指数的等级描述
    const specificDescriptions: Record<string, Record<string, string>> = {
      [INDICES_TYPES.UV]: {
        '1': '最弱',
        '2': '弱',
        '3': '中等',
        '4': '强',
        '5': '很强',
      },
      [INDICES_TYPES.COLD]: {
        '1': '少发',
        '2': '较易发',
        '3': '易发',
        '4': '极易发',
      },
    };

    if (indexType && specificDescriptions[indexType]) {
      return specificDescriptions[indexType][level] || generalDescriptions[level] || '未知';
    }

    return generalDescriptions[level] || '未知';
  }
}