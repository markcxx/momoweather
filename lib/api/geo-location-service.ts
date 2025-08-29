/**
 * 地理位置服务 - 基于腾讯地图IP定位API
 */

// 腾讯地图IP定位API响应接口
export interface TencentLocationResponse {
  status: number
  message: string
  result: {
    ip: string
    location: {
      lat: number
      lng: number
    }
    ad_info: {
      nation: string
      province: string
      city: string
      district: string
      adcode: string
    }
  }
}

// 标准化的位置信息接口
export interface LocationInfo {
  ip: string
  latitude: number
  longitude: number
  country: string
  province: string
  city: string
  district: string
  adcode: string
  fullAddress: string
}

// 腾讯地图API配置
const TENCENT_MAP_CONFIG = {
  API_KEY: 'T3EBZ-TJ7LI-YRBG2-5ZLUR-KD3OS-U6BJO',
  BASE_URL: 'https://apis.map.qq.com/ws/location/v1/ip',
  TIMEOUT: 10000 // 10秒超时
}

/**
 * 地理位置服务类
 */
export class GeoLocationService {
  /**
   * 使用腾讯地图IP定位API获取用户位置
   * @returns Promise<LocationInfo>
   */
  static async getCurrentLocation(): Promise<LocationInfo> {
    return new Promise((resolve, reject) => {
      const callbackName = 'tencentLocationCallback' + Date.now()
      const script = document.createElement('script')
      
      // 设置超时处理
      const timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error('请求超时，请检查网络连接'))
      }, TENCENT_MAP_CONFIG.TIMEOUT)
      
      // 清理函数
      const cleanup = () => {
        clearTimeout(timeoutId)
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
        delete (window as any)[callbackName]
      }
      
      // 创建全局回调函数
      ;(window as any)[callbackName] = (data: TencentLocationResponse) => {
        cleanup()
        
        if (data.status === 0) {
          const locationInfo = this.parseLocationResponse(data)
          resolve(locationInfo)
        } else {
          reject(new Error(`API返回错误: ${data.message}`))
        }
      }
      
      // 设置错误处理
      script.onerror = () => {
        cleanup()
        reject(new Error('API请求失败，请检查网络连接'))
      }
      
      // 构建请求URL
      const url = `${TENCENT_MAP_CONFIG.BASE_URL}?key=${TENCENT_MAP_CONFIG.API_KEY}&output=jsonp&callback=${callbackName}`
      script.src = url
      
      document.head.appendChild(script)
    })
  }
  
  /**
   * 解析腾讯地图API响应数据
   * @param response 腾讯地图API响应
   * @returns LocationInfo
   */
  private static parseLocationResponse(response: TencentLocationResponse): LocationInfo {
    const { result } = response
    const { ad_info, location, ip } = result
    
    // 构建完整地址
    let fullAddress = ad_info.nation
    if (ad_info.nation === '中国') {
      fullAddress = `${ad_info.province} ${ad_info.city} ${ad_info.district}`.trim()
    }
    
    return {
      ip,
      latitude: location.lat,
      longitude: location.lng,
      country: ad_info.nation,
      province: ad_info.province,
      city: ad_info.city,
      district: ad_info.district,
      adcode: ad_info.adcode,
      fullAddress
    }
  }
  
  /**
   * 清理地址中的冗余层级（如"市辖区"）
   * @param address 原始地址
   * @returns 清理后的地址
   */
  private static cleanAddress(address: string): string {
    return address
      .replace(/市辖区/g, '') // 去除"市辖区"层级
      .replace(/\s+/g, '') // 去除多余空格
      .trim()
  }

  /**
   * 从多个搜索结果中选择最佳匹配
   * @param locations 搜索结果列表
   * @param searchTerm 搜索词
   * @returns 最佳匹配的位置
   */
  private static selectBestMatch(locations: any[], searchTerm: string): any {
    // 开始匹配分析
    
    // 1. 优先进行县级区划名称的精确匹配
    const exactCountyMatch = locations.find(loc => {
      const cleanName = this.cleanAddress(loc.name || '')
      const isCountyLevel = loc.adm2 && (cleanName.endsWith('区') || cleanName.endsWith('县') || cleanName.endsWith('市'))
      const exactMatch = cleanName === searchTerm
      
      // 县级精确匹配检查
      
      return isCountyLevel && exactMatch
    })
    
    if (exactCountyMatch) {
      // 找到县级精确匹配
      return exactCountyMatch
    }
    
    // 2. 县级区划部分匹配
    const partialCountyMatch = locations.find(loc => {
      const cleanName = this.cleanAddress(loc.name || '')
      const isCountyLevel = loc.adm2 && (cleanName.endsWith('区') || cleanName.endsWith('县') || cleanName.endsWith('市'))
      const partialMatch = cleanName.includes(searchTerm) || searchTerm.includes(cleanName)
      
      // 县级部分匹配检查
      
      return isCountyLevel && partialMatch
    })
    
    if (partialCountyMatch) {
      // 找到县级部分匹配
      return partialCountyMatch
    }
    
    // 3. 任意级别的精确匹配
    const anyExactMatch = locations.find(loc => {
      const cleanName = this.cleanAddress(loc.name || '')
      const exactMatch = cleanName === searchTerm
      
      // 任意级别精确匹配检查
      
      return exactMatch
    })
    
    if (anyExactMatch) {
      // 找到任意级别精确匹配
      return anyExactMatch
    }
    
    // 4. 行政区划代码匹配（优先选择更具体的区划）
    const sortedBySpecificity = [...locations].sort((a, b) => {
      // 优先选择有adm2（县级）的结果
      if (a.adm2 && !b.adm2) return -1
      if (!a.adm2 && b.adm2) return 1
      
      // 其次按照名称相似度排序
      const aName = this.cleanAddress(a.name || '')
      const bName = this.cleanAddress(b.name || '')
      const aSimilarity = this.calculateSimilarity(searchTerm, aName)
      const bSimilarity = this.calculateSimilarity(searchTerm, bName)
      
      return bSimilarity - aSimilarity
    })
    
    // 按特异性排序结果
    
    // 5. 默认返回第一个结果
    const defaultResult = sortedBySpecificity[0]
    // 使用默认结果
    
    return defaultResult
  }

  /**
   * 计算字符串相似度
   * @param str1 字符串1
   * @param str2 字符串2
   * @returns 相似度分数（0-1）
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1
    if (str1.includes(str2) || str2.includes(str1)) return 0.8
    
    // 简单的字符重叠度计算
    const chars1 = new Set(str1)
    const chars2 = new Set(str2)
    const intersection = new Set([...chars1].filter(x => chars2.has(x)))
    const union = new Set([...chars1, ...chars2])
    
    return intersection.size / union.size
  }

  /**
   * 通过城市搜索API获取LocationID
   * @param location 位置名称（支持县级行政区名称）
   * @param adm 上级行政区划（可选）
   * @returns Promise<string> LocationID
   */
  static async getLocationIdByAPI(location: string, adm?: string): Promise<string> {
    try {
      // 清理和标准化位置名称
      const cleanLocation = this.cleanAddress(location.trim())
      
      const params = new URLSearchParams({
         location: cleanLocation,
         number: '10', // 增加返回结果数量，提高匹配成功率
         lang: 'zh'
       })
       
       if (adm) {
         const cleanAdm = this.cleanAddress(adm.trim())
         params.append('adm', cleanAdm)
       }
      
      // 发送城市搜索请求
      
      const response = await fetch(`/api/geo/city/lookup?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`城市搜索API请求失败: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      // 城市搜索API响应
      
      if (data.code === '200' && data.location && data.location.length > 0) {
         const selectedLocation = this.selectBestMatch(data.location, cleanLocation)
         // 选择的位置
         
         return selectedLocation.id
       } else {
         throw new Error(`未找到城市: ${cleanLocation}，API返回: ${JSON.stringify(data)}`)
       }
    } catch (error) {
      // 城市搜索API调用失败
      throw error
    }
  }
  
  /**
   * 通过经纬度获取LocationID
   * @param lat 纬度
   * @param lng 经度
   * @returns Promise<string> LocationID
   */
  static async getLocationIdByCoordinates(lat: number, lng: number): Promise<string> {
    try {
      const location = `${lng},${lat}` // 经度在前，纬度在后
      return await this.getLocationIdByAPI(location)
    } catch (error) {
      // 经纬度查询LocationID失败
      throw error
    }
  }
  

  
  /**
   * 获取用户位置并返回对应的LocationID
   * @returns Promise<{locationInfo: LocationInfo, locationId: string}>
   */
  static async getLocationWithId(): Promise<{locationInfo: LocationInfo, locationId: string}> {
    try {
      const locationInfo = await this.getCurrentLocation()
      let locationId: string
      
      try {
        // 优先使用县级行政区名称查询
        if (locationInfo.district) {
          // 使用县级行政区查询LocationID
          locationId = await this.getLocationIdByAPI(locationInfo.district, locationInfo.city)
        } else if (locationInfo.city) {
          // 使用城市名称查询LocationID
          locationId = await this.getLocationIdByAPI(locationInfo.city, locationInfo.province)
        } else {
          throw new Error('无有效的城市信息')
        }
      } catch (apiError) {
        // 城市搜索API失败，尝试使用经纬度查询
        try {
          // 如果城市名称查询失败，使用经纬度查询
          locationId = await this.getLocationIdByCoordinates(locationInfo.latitude, locationInfo.longitude)
        } catch (coordError) {
          // 经纬度查询失败，使用默认LocationID
          throw new Error('无法获取有效的LocationID')
        }
      }
      
      // 最终获取的LocationID
      
      return {
        locationInfo,
        locationId
      }
    } catch (error) {
      throw new Error(`获取位置信息失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
}

// 导出默认实例
export default GeoLocationService