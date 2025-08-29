import { CityData, initializeCityData } from '../data/city-data';

export class CitySearchService {
  private static instance: CitySearchService;
  private cityIndex: Map<string, CityData[]> = new Map();
  private isInitialized = false;
  
  constructor() {
    this.initialize();
  }
  
  static getInstance(): CitySearchService {
    if (!CitySearchService.instance) {
      CitySearchService.instance = new CitySearchService();
    }
    return CitySearchService.instance;
  }
  
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const cities = await initializeCityData();
      this.buildSearchIndex(cities);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize city search service:', error);
    }
  }
  
  // 构建搜索索引
  private buildSearchIndex(cities: CityData[]): void {
    this.cityIndex.clear();
    
    cities.forEach(city => {
      // 按城市名称索引
      this.addToIndex(city.name, city);
      
      // 按拼音索引
      this.addToIndex(city.pinyin, city);
      
      // 按拼音首字母索引
      this.addToIndex(city.pinyinShort, city);
      
      // 按完整名称索引
      this.addToIndex(city.fullName, city);
      
      // 按名称的每个字符索引（支持部分匹配）
      for (let i = 0; i < city.name.length; i++) {
        for (let j = i + 1; j <= city.name.length; j++) {
          this.addToIndex(city.name.substring(i, j), city);
        }
      }
      
      // 按拼音的每个字符索引
      for (let i = 0; i < city.pinyin.length; i++) {
        for (let j = i + 1; j <= city.pinyin.length; j++) {
          this.addToIndex(city.pinyin.substring(i, j), city);
        }
      }
    });
  }
  
  private addToIndex(key: string, city: CityData): void {
    const normalizedKey = key.toLowerCase().trim();
    if (!normalizedKey) return;
    
    if (!this.cityIndex.has(normalizedKey)) {
      this.cityIndex.set(normalizedKey, []);
    }
    
    const cities = this.cityIndex.get(normalizedKey)!;
    // 避免重复添加
    if (!cities.find(c => c.code === city.code)) {
      cities.push(city);
    }
  }
  
  // 智能搜索方法
  async search(query: string, limit: number = 10): Promise<CityData[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const results = new Map<string, { city: CityData; score: number }>();
    
    // 1. 精确匹配
    this.addResults(results, normalizedQuery, 100);
    
    // 2. 前缀匹配
    for (const [key, cities] of this.cityIndex) {
      if (key.startsWith(normalizedQuery)) {
        cities.forEach(city => {
          const score = this.calculateScore(normalizedQuery, key, city);
          this.updateResult(results, city, score - 10);
        });
      }
    }
    
    // 3. 包含匹配
    if (results.size < limit) {
      for (const [key, cities] of this.cityIndex) {
        if (key.includes(normalizedQuery)) {
          cities.forEach(city => {
            const score = this.calculateScore(normalizedQuery, key, city);
            this.updateResult(results, city, score - 20);
          });
        }
      }
    }
    
    // 4. 模糊匹配（编辑距离）
    if (results.size < limit && normalizedQuery.length > 1) {
      for (const [key, cities] of this.cityIndex) {
        const distance = this.levenshteinDistance(normalizedQuery, key);
        if (distance <= 2 && distance < normalizedQuery.length) {
          cities.forEach(city => {
            const score = this.calculateScore(normalizedQuery, key, city) - distance * 15;
            this.updateResult(results, city, score - 30);
          });
        }
      }
    }
    
    return Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.city);
  }
  
  private addResults(results: Map<string, { city: CityData; score: number }>, query: string, baseScore: number): void {
    const cities = this.cityIndex.get(query) || [];
    cities.forEach(city => {
      const score = this.calculateScore(query, query, city) + baseScore;
      this.updateResult(results, city, score);
    });
  }
  
  private updateResult(results: Map<string, { city: CityData; score: number }>, city: CityData, score: number): void {
    const key = city.code;
    if (!results.has(key) || results.get(key)!.score < score) {
      results.set(key, { city, score });
    }
  }
  
  private calculateScore(query: string, matchedKey: string, city: CityData): number {
    let score = 0;
    
    // 级别权重：县级 > 市级 > 省级
    switch (city.level) {
      case 'county': score += 30; break;
      case 'city': score += 20; break;
      case 'province': score += 10; break;
    }
    
    // 匹配类型权重
    if (matchedKey === city.name.toLowerCase()) score += 50;
    else if (matchedKey === city.pinyin) score += 40;
    else if (matchedKey === city.pinyinShort) score += 30;
    else if (matchedKey === city.fullName.toLowerCase()) score += 45;
    
    // 查询长度权重
    score += query.length * 2;
    
    // 名称长度权重（短名称优先）
    score += Math.max(0, 20 - city.name.length);
    
    return score;
  }
  
  // 编辑距离算法
  private levenshteinDistance(str1: string, str2: string): number {
    if (str1.length === 0) return str2.length;
    if (str2.length === 0) return str1.length;
    
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  // 获取热门城市
  async getPopularCities(): Promise<CityData[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const popularCityNames = [
      '北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市', '武汉市', '成都市',
      '西安市', '重庆市', '天津市', '苏州市', '长沙市', '郑州市', '青岛市', '大连市'
    ];
    
    const results: CityData[] = [];
    
    for (const cityName of popularCityNames) {
      const searchResults = await this.search(cityName, 1);
      if (searchResults.length > 0) {
        results.push(searchResults[0]);
      }
    }
    
    return results;
  }
}