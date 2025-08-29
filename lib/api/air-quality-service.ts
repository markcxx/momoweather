// 空气质量服务API类
import { api } from './http-client';
import { API_CONFIG } from './config';
import type {
  CurrentAirQualityResponse,
  WeatherRequestParams,
} from './types';

// 每日空气质量预报响应
export interface DailyAirQualityResponse {
  metadata: {
    tag: string;
  };
  days: Array<{
    forecastStartTime: string;
    forecastEndTime: string;
    indexes: Array<{
      code: string;
      name: string;
      aqi: number;
      aqiDisplay: string;
      level?: string;
      category?: string;
      color: {
        red: number;
        green: number;
        blue: number;
        alpha: number;
      };
      primaryPollutant?: {
        code: string;
        name: string;
        fullName: string;
      };
      health?: {
        effect: string;
        advice: {
          generalPopulation: string;
          sensitivePopulation: string;
        };
      };
    }>;
    pollutants: Array<{
      code: string;
      name: string;
      fullName: string;
      concentration: {
        value: number;
        unit: string;
      };
      subIndexes: Array<{
        code: string;
        aqi: number;
        aqiDisplay: string;
      }>;
    }>;
  }>;
}

// 逐小时空气质量预报响应
export interface HourlyAirQualityResponse {
  metadata: {
    tag: string;
  };
  hours: Array<{
    forecastTime: string;
    indexes: Array<{
      code: string;
      name: string;
      aqi: number;
      aqiDisplay: string;
      level?: string;
      category?: string;
      color: {
        red: number;
        green: number;
        blue: number;
        alpha: number;
      };
      primaryPollutant?: {
        code: string;
        name: string;
        fullName: string;
      };
      health?: {
        effect: string;
        advice: {
          generalPopulation: string;
          sensitivePopulation: string;
        };
      };
    }>;
    pollutants: Array<{
      code: string;
      name: string;
      fullName: string;
      concentration: {
        value: number;
        unit: string;
      };
      subIndexes: Array<{
        code: string;
        aqi: number;
        aqiDisplay: string;
      }>;
    }>;
  }>;
}

/**
 * 空气质量服务类
 * 提供空气质量数据的获取功能
 */
export class AirQualityService {
  /**
   * 获取实时空气质量数据
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 实时空气质量数据
   */
  static async getCurrentAirQuality(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<CurrentAirQualityResponse> {
    const queryParams = {
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      ...params,
    };

    return api.get<CurrentAirQualityResponse>(
      `/air-quality/realtime/${location}`,
      queryParams
    );
  }

  /**
   * 获取每日空气质量预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 每日空气质量预报数据
   */
  static async getDailyAirQuality(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<DailyAirQualityResponse> {
    const queryParams = {
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      ...params,
    };

    return api.get<DailyAirQualityResponse>(
      `/air-quality/daily/${location}`,
      queryParams
    );
  }

  /**
   * 获取逐小时空气质量预报
   * @param location 位置参数（LocationID或经纬度）
   * @param params 可选参数
   * @returns 逐小时空气质量预报数据
   */
  static async getHourlyAirQuality(
    location: string = API_CONFIG.DEFAULT_LOCATION,
    params?: Omit<WeatherRequestParams, 'location'>
  ): Promise<HourlyAirQualityResponse> {
    const queryParams = {
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      ...params,
    };

    return api.get<HourlyAirQualityResponse>(
      `/air-quality/hourly/${location}`,
      queryParams
    );
  }

  /**
   * 获取空气质量指数等级描述
   * @param aqi 空气质量指数值
   * @param indexCode 指数代码（如 'us-epa', 'qaqi'）
   * @returns 等级描述对象
   */
  static getAQILevelDescription(aqi: number, indexCode: string = 'us-epa') {
    if (indexCode === 'us-epa') {
      if (aqi <= 50) {
        return {
          level: '1',
          category: '优',
          color: '#00e400',
          description: '空气质量令人满意，基本无空气污染',
          advice: '各类人群可正常活动'
        };
      } else if (aqi <= 100) {
        return {
          level: '2',
          category: '良',
          color: '#ffff00',
          description: '空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响',
          advice: '极少数异常敏感人群应减少户外活动'
        };
      } else if (aqi <= 150) {
        return {
          level: '3',
          category: '轻度污染',
          color: '#ff7e00',
          description: '易感人群症状有轻度加剧，健康人群出现刺激症状',
          advice: '儿童、老年人及心脏病、呼吸系统疾病患者应减少长时间、高强度的户外锻炼'
        };
      } else if (aqi <= 200) {
        return {
          level: '4',
          category: '中度污染',
          color: '#ff0000',
          description: '进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响',
          advice: '儿童、老年人及心脏病、呼吸系统疾病患者避免长时间、高强度的户外锻炼，一般人群适量减少户外运动'
        };
      } else if (aqi <= 300) {
        return {
          level: '5',
          category: '重度污染',
          color: '#99004c',
          description: '心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状',
          advice: '儿童、老年人和病人应停留在室内，避免体力消耗，一般人群避免户外活动'
        };
      } else {
        return {
          level: '6',
          category: '严重污染',
          color: '#7e0023',
          description: '健康人群运动耐受力降低，有明显强烈症状，提前出现某些疾病',
          advice: '儿童、老年人和病人应停留在室内，避免体力消耗，一般人群避免户外活动'
        };
      }
    }
    
    // 默认返回未知等级
    return {
      level: 'unknown',
      category: '未知',
      color: '#999999',
      description: '无法确定空气质量等级',
      advice: '请参考官方空气质量指导'
    };
  }

  /**
   * 获取主要污染物描述
   * @param pollutantCode 污染物代码
   * @returns 污染物描述
   */
  static getPollutantDescription(pollutantCode: string) {
    const pollutants: Record<string, { name: string; fullName: string; description: string }> = {
      'pm2p5': {
        name: 'PM2.5',
        fullName: '细颗粒物',
        description: '直径小于等于2.5微米的颗粒物，能够进入肺泡'
      },
      'pm10': {
        name: 'PM10',
        fullName: '可吸入颗粒物',
        description: '直径小于等于10微米的颗粒物'
      },
      'no2': {
        name: 'NO₂',
        fullName: '二氧化氮',
        description: '主要来源于机动车尾气和工业排放'
      },
      'so2': {
        name: 'SO₂',
        fullName: '二氧化硫',
        description: '主要来源于燃煤和工业排放'
      },
      'o3': {
        name: 'O₃',
        fullName: '臭氧',
        description: '地面臭氧主要由氮氧化物和挥发性有机物在阳光下反应生成'
      },
      'co': {
        name: 'CO',
        fullName: '一氧化碳',
        description: '主要来源于机动车尾气和燃烧不完全'
      }
    };

    return pollutants[pollutantCode] || {
      name: pollutantCode.toUpperCase(),
      fullName: '未知污染物',
      description: '暂无描述信息'
    };
  }
}