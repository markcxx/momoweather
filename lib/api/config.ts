// API配置文件
export const API_CONFIG = {
  // 基础URL - 使用Next.js API路由
  BASE_URL: '/api',
  
  // 默认参数
  DEFAULT_PARAMS: {
    unit: 'm', // 公制单位
    lang: 'zh', // 中文
  },
  
  // 请求超时时间（毫秒）- 增加到30秒以适应API代理
  TIMEOUT: 30000,
  
  // 请求频率限制
  RATE_LIMIT: {
    maxRequests: 1000,
    perMinute: 60 * 1000,
  },
  
  // 默认位置（北京）
  // 移除默认位置，避免自动请求北京数据
  
  // 错误重试配置
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1秒
  },
} as const;

// 状态码映射
export const STATUS_CODES = {
  SUCCESS: '200',
  BAD_REQUEST: '400',
  UNAUTHORIZED: '401',
  NOT_FOUND: '404',
  INTERNAL_ERROR: '500',
} as const;

// 天气指数类型映射
export const INDICES_TYPES = {
  ALL: '0',          // 全部天气指数
  SPORT: '1',        // 运动指数
  CAR_WASH: '2',     // 洗车指数
  CLOTHING: '3',     // 穿衣指数
  FISHING: '4',      // 钓鱼指数
  UV: '5',           // 紫外线指数
  TRAVEL: '6',       // 旅游指数
  ALLERGY: '7',      // 花粉过敏指数
  COMFORT: '8',      // 舒适度指数
  COLD: '9',         // 感冒指数
  AIR_POLLUTION: '10', // 空气污染扩散条件指数
  AC: '11',          // 空调开启指数
  SUNGLASSES: '12',  // 太阳镜指数
  MAKEUP: '13',      // 化妆指数
  DRYING: '14',      // 晾晒指数
  TRAFFIC: '15',     // 交通指数
  SUN_PROTECTION: '16', // 防晒指数
} as const;