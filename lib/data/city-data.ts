// 城市数据类型定义
export interface CityData {
  code: string;           // 唯一标识
  name: string;           // 城市名称
  pinyin: string;         // 完整拼音
  pinyinShort: string;    // 拼音首字母
  level: 'province' | 'city' | 'county'; // 行政级别
  parentName?: string;    // 父级名称
  fullName: string;       // 完整名称
  path: string[];         // 层级路径
}

// 拼音转换函数（简化版）
function convertToPinyin(text: string): { full: string; short: string } {
  // 简化的拼音映射表（实际项目中建议使用专业的拼音库）
  const pinyinMap: Record<string, string> = {
    '北': 'bei', '京': 'jing', '天': 'tian', '津': 'jin', '河': 'he',
    '山': 'shan', '西': 'xi', '内': 'nei', '蒙': 'meng', '古': 'gu', '辽': 'liao',
    '宁': 'ning', '吉': 'ji', '林': 'lin', '黑': 'hei', '龙': 'long', '江': 'jiang',
    '上': 'shang', '海': 'hai', '苏': 'su', '浙': 'zhe', '安': 'an', '徽': 'hui',
    '福': 'fu', '建': 'jian', '东': 'dong', '南': 'nan', '湖': 'hu',
    '广': 'guang', '壮': 'zhuang', '族': 'zu', '自': 'zi', '治': 'zhi', '区': 'qu',
    '重': 'chong', '庆': 'qing', '四': 'si', '川': 'chuan', '贵': 'gui',
    '州': 'zhou', '云': 'yun', '藏': 'zang', '陕': 'shan', '甘': 'gan', '肃': 'su',
    '青': 'qing', '夏': 'xia', '回': 'hui', '新': 'xin', '疆': 'jiang', '维': 'wei',
    '尔': 'er', '市': 'shi', '省': 'sheng', '县': 'xian', '镇': 'zhen', '乡': 'xiang',
    '村': 'cun', '街': 'jie', '道': 'dao', '办': 'ban', '事': 'shi', '处': 'chu',
    '石': 'shi', '家': 'jia', '庄': 'zhuang', '唐': 'tang', '秦': 'qin', '皇': 'huang',
    '岛': 'dao', '邯': 'han', '郸': 'dan', '邢': 'xing', '台': 'tai', '保': 'bao',
    '定': 'ding', '张': 'zhang', '口': 'kou', '承': 'cheng', '德': 'de',
    '沧': 'cang', '廊': 'lang', '坊': 'fang', '衡': 'heng', '水': 'shui'
  };
  
  let fullPinyin = '';
  let shortPinyin = '';
  
  for (const char of text) {
    const pinyin = pinyinMap[char] || char.toLowerCase();
    fullPinyin += pinyin;
    shortPinyin += pinyin[0] || char;
  }
  
  return { full: fullPinyin, short: shortPinyin };
}

// 解析城市数据
export function parseCityData(rawData: Record<string, any>): CityData[] {
  const cities: CityData[] = [];
  let codeCounter = 1;
  
  Object.entries(rawData).forEach(([provinceName, provinceData]) => {
    const provinceCode = `${codeCounter.toString().padStart(2, '0')}0000`;
    const provincePinyin = convertToPinyin(provinceName);
    
    // 添加省级数据
    cities.push({
      code: provinceCode,
      name: provinceName,
      pinyin: provincePinyin.full,
      pinyinShort: provincePinyin.short,
      level: 'province',
      fullName: provinceName,
      path: [provinceName]
    });
    
    let cityCounter = 1;
    Object.entries(provinceData as Record<string, string[]>).forEach(([cityName, districts]) => {
      const cityCode = `${codeCounter.toString().padStart(2, '0')}${cityCounter.toString().padStart(2, '0')}00`;
      const cityPinyin = convertToPinyin(cityName);
      
      // 添加市级数据
      cities.push({
        code: cityCode,
        name: cityName,
        pinyin: cityPinyin.full,
        pinyinShort: cityPinyin.short,
        level: 'city',
        parentName: provinceName,
        fullName: `${provinceName}${cityName}`,
        path: [provinceName, cityName]
      });
      
      // 添加区县级数据
      districts.forEach((districtName, index) => {
        const districtCode = `${codeCounter.toString().padStart(2, '0')}${cityCounter.toString().padStart(2, '0')}${(index + 1).toString().padStart(2, '0')}`;
        const districtPinyin = convertToPinyin(districtName);
        
        cities.push({
          code: districtCode,
          name: districtName,
          pinyin: districtPinyin.full,
          pinyinShort: districtPinyin.short,
          level: 'county',
          parentName: cityName,
          fullName: `${provinceName}${cityName}${districtName}`,
          path: [provinceName, cityName, districtName]
        });
      });
      
      cityCounter++;
    });
    
    codeCounter++;
  });
  
  return cities;
}

// 导出处理后的城市数据
let cityDatabase: CityData[] = [];

export async function initializeCityData(): Promise<CityData[]> {
  if (cityDatabase.length > 0) {
    return cityDatabase;
  }
  
  try {
    const response = await fetch('/area_code_2024.json');
    const rawData = await response.json();
    cityDatabase = parseCityData(rawData);
    return cityDatabase;
  } catch (error) {
    console.error('Failed to load city data:', error);
    return [];
  }
}

export function getCityDatabase(): CityData[] {
  return cityDatabase;
}