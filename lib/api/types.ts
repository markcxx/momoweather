// API响应类型定义

// 基础响应接口
export interface BaseResponse {
  code: string;
  updateTime?: string;
  fxLink?: string;
  refer?: {
    sources: string[];
    license: string[];
  };
}

// 实时天气响应
export interface CurrentWeatherResponse extends BaseResponse {
  now: {
    obsTime: string;      // 数据观测时间
    temp: string;         // 温度
    feelsLike: string;    // 体感温度
    icon: string;         // 天气状况图标代码
    text: string;         // 天气状况文字描述
    wind360: string;      // 风向360角度
    windDir: string;      // 风向
    windScale: string;    // 风力等级
    windSpeed: string;    // 风速
    humidity: string;     // 相对湿度
    precip: string;       // 过去1小时降水量
    pressure: string;     // 大气压强
    vis: string;          // 能见度
    cloud?: string;       // 云量
    dew?: string;         // 露点温度
  };
}

// 小时预报数据项
export interface HourlyWeatherItem {
  fxTime: string;       // 预报时间
  temp: string;         // 温度
  icon: string;         // 天气状况图标代码
  text: string;         // 天气状况文字描述
  wind360: string;      // 风向360角度
  windDir: string;      // 风向
  windScale: string;    // 风力等级
  windSpeed: string;    // 风速
  humidity: string;     // 相对湿度
  pop: string;          // 降水概率
  precip: string;       // 降水量
  pressure: string;     // 大气压强
  cloud?: string;       // 云量
  dew?: string;         // 露点温度
}

// 小时预报响应
export interface HourlyWeatherResponse extends BaseResponse {
  hourly: HourlyWeatherItem[];
}

// 每日预报数据项
export interface DailyWeatherItem {
  fxDate: string;           // 预报日期
  sunrise: string;          // 日出时间
  sunset: string;           // 日落时间
  moonrise?: string;        // 月升时间
  moonset?: string;         // 月落时间
  moonPhase?: string;       // 月相名称
  moonPhaseIcon?: string;   // 月相图标代码
  tempMax: string;          // 最高温度
  tempMin: string;          // 最低温度
  iconDay: string;          // 白天天气状况图标代码
  textDay: string;          // 白天天气状况文字描述
  iconNight: string;        // 夜间天气状况图标代码
  textNight: string;        // 夜间天气状况文字描述
  wind360Day: string;       // 白天风向360角度
  windDirDay: string;       // 白天风向
  windScaleDay: string;     // 白天风力等级
  windSpeedDay: string;     // 白天风速
  wind360Night: string;     // 夜间风向360角度
  windDirNight: string;     // 夜间风向
  windScaleNight: string;   // 夜间风力等级
  windSpeedNight: string;   // 夜间风速
  humidity: string;         // 相对湿度
  precip: string;           // 降水量
  pressure: string;         // 大气压强
  vis: string;              // 能见度
  cloud?: string;           // 云量
  uvIndex: string;          // 紫外线强度指数
}

// 每日预报响应
export interface DailyWeatherResponse extends BaseResponse {
  daily: DailyWeatherItem[];
}

// 空气质量指数
export interface AirQualityIndex {
  code: string;             // 空气质量指数Code
  name: string;             // 空气质量指数名称
  aqi: number;              // 空气质量指数值
  aqiDisplay: string;       // 空气质量指数显示值
  level?: string;           // 空气质量指数等级
  category?: string;        // 空气质量指数类别
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
}

// 污染物数据
export interface Pollutant {
  code: string;             // 污染物Code
  name: string;             // 污染物名称
  fullName: string;         // 污染物全称
  concentration: {
    value: number;          // 污染物浓度值
    unit: string;           // 污染物浓度单位
  };
  subIndexes: {
    code: string;
    aqi: number;
    aqiDisplay: string;
  }[];
}

// 监测站信息
export interface AirQualityStation {
  id: string;               // 监测站ID
  name: string;             // 监测站名称
}

// 实时空气质量响应
export interface CurrentAirQualityResponse {
  metadata: {
    tag: string;
  };
  indexes: AirQualityIndex[];
  pollutants: Pollutant[];
  stations: AirQualityStation[];
}

// 天气指数数据项
export interface WeatherIndexItem {
  date: string;             // 预报日期
  type: string;             // 指数类型
  name: string;             // 指数名称
  level: string;            // 指数等级
  category: string;         // 指数类别
  text: string;             // 指数描述
}

// 天气指数响应
export interface WeatherIndicesResponse extends BaseResponse {
  daily: WeatherIndexItem[];
}

// 城市信息
export interface CityInfo {
  name: string;             // 城市名称
  id: string;               // 城市ID
  lat: string;              // 纬度
  lon: string;              // 经度
  adm2: string;             // 二级行政区划
  adm1: string;             // 一级行政区划
  country: string;          // 国家
  tz: string;               // 时区
  utcOffset: string;        // UTC偏移
  isDst: string;            // 是否夏令时
  type: string;             // 类型
  rank: string;             // 排名
  fxLink: string;           // 链接
}

// 城市搜索响应
export interface CitySearchResponse extends BaseResponse {
  location: CityInfo[];
}

// POI信息
export interface POIInfo {
  name: string;             // POI名称
  id: string;               // POI ID
  lat: string;              // 纬度
  lon: string;              // 经度
  adm2: string;             // 二级行政区划
  adm1: string;             // 一级行政区划
  country: string;          // 国家
  tz: string;               // 时区
  utcOffset: string;        // UTC偏移
  isDst: string;            // 是否夏令时
  type: string;             // POI类型
  rank: string;             // 排名
  fxLink: string;           // 链接
}

// POI搜索响应
export interface POISearchResponse extends BaseResponse {
  poi: POIInfo[];
}

// API错误响应
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 请求参数类型
export interface WeatherRequestParams {
  location?: string;
  lang?: string;
  unit?: string;
}

export interface IndicesRequestParams extends WeatherRequestParams {
  type: string; // 指数类型，多个用逗号分隔
}

export interface CitySearchParams {
  location: string;
  adm?: string;
  range?: string;
  number?: number;
  lang?: string;
}

export interface POISearchParams {
  location: string;
  type: 'scenic' | 'CSTA' | 'TSTA';
  city?: string;
  number?: number;
  lang?: string;
}

export interface POIRangeParams {
  location: string; // 经纬度坐标
  type: 'scenic' | 'CSTA' | 'TSTA';
  radius?: number;
  number?: number;
  lang?: string;
}