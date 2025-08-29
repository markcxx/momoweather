# 天气API接口文档

## 基础信息

- **基础URL**: `https://api.momoweather.com`
- **认证方式**: JWT Bearer Token
- **请求格式**: JSON
- **响应格式**: JSON
- **字符编码**: UTF-8

## 通用参数说明

### location 参数格式
所有接口的 `location` 参数支持两种格式：
- **LocationID**: 如 `101010100` (北京)
- **经纬度**: 如 `116.41,39.92` (经度,纬度)

---

## 1. 天气预报服务

### 1.1 实时天气

**接口**: `GET /weather/now/{location}`

**参数**:
- `location` (必需): 位置参数
- `lang` (可选): 语言设置
- `unit` (可选): 单位设置，默认 `m` (公制)

**请求示例**:
```
GET https://api.momoweather.com/weather/now/101010100?unit=m&lang=zh
GET https://api.momoweather.com/weather/now/116.41,39.92?unit=m
```

**返回值**:
```json
{
  "code": "200",
  "updateTime": "2020-06-30T22:00+08:00",
  "fxLink": "http://hfx.link/2ax1",
  "now": {
    "obsTime": "2020-06-30T21:40+08:00",
    "temp": "24",
    "feelsLike": "26",
    "icon": "101",
    "text": "多云",
    "wind360": "123",
    "windDir": "东南风",
    "windScale": "1",
    "windSpeed": "3",
    "humidity": "72",
    "precip": "0.0",
    "pressure": "1003",
    "vis": "16",
    "cloud": "10",
    "dew": "21"
  },
  "refer": {
    "sources": [
      "QWeather",
      "NMC",
      "ECMWF"
    ],
    "license": [
      "QWeather Developers License"
    ]
  }
}
```

code 请参考状态码
updateTime 当前API的最近更新时间
fxLink 当前数据的响应式页面，便于嵌入网站或应用
now.obsTime 数据观测时间
now.temp 温度，默认单位：摄氏度
now.feelsLike 体感温度，默认单位：摄氏度
now.icon 天气状况的图标代码
now.text 天气状况的文字描述，包括阴晴雨雪等天气状态的描述
now.wind360 风向360角度
now.windDir 风向
now.windScale 风力等级
now.windSpeed 风速，公里/小时
now.humidity 相对湿度，百分比数值
now.precip 过去1小时降水量，默认单位：毫米
now.pressure 大气压强，默认单位：百帕
now.vis 能见度，默认单位：公里
now.cloud 云量，百分比数值。可能为空
now.dew 露点温度。可能为空
refer.sources 原始数据来源，或数据源说明，可能为空
refer.license 数据许可或版权声明，可能为空

### 1.2 24小时天气预报

**接口**: `GET /weather/hourly/24h/{location}`

**参数**:
- `location` (必需): 位置参数
- `lang` (可选): 语言设置
- `unit` (可选): 单位设置

**请求示例**:
```
GET https://api.momoweather.com/weather/hourly/24h/101010100
GET https://api.momoweather.com/weather/hourly/24h/116.41,39.92?unit=m
```

**返回值**:
```json
{
  "code": "200",
  "updateTime": "2021-02-16T13:35+08:00",
  "fxLink": "http://hfx.link/2ax1",
  "hourly": [
    {
      "fxTime": "2021-02-16T15:00+08:00",
      "temp": "2",
      "icon": "100",
      "text": "晴",
      "wind360": "335",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "20",
      "humidity": "11",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "0",
      "dew": "-25"
    },
    {
      "fxTime": "2021-02-16T16:00+08:00",
      "temp": "1",
      "icon": "100",
      "text": "晴",
      "wind360": "339",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "24",
      "humidity": "11",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "0",
      "dew": "-26"
    },
    {
      "fxTime": "2021-02-16T17:00+08:00",
      "temp": "0",
      "icon": "100",
      "text": "晴",
      "wind360": "341",
      "windDir": "西北风",
      "windScale": "4-5",
      "windSpeed": "25",
      "humidity": "11",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1026",
      "cloud": "0",
      "dew": "-26"
    },
    {
      "fxTime": "2021-02-16T18:00+08:00",
      "temp": "0",
      "icon": "150",
      "text": "晴",
      "wind360": "344",
      "windDir": "西北风",
      "windScale": "4-5",
      "windSpeed": "25",
      "humidity": "12",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-16T19:00+08:00",
      "temp": "-2",
      "icon": "150",
      "text": "晴",
      "wind360": "349",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "24",
      "humidity": "13",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-16T20:00+08:00",
      "temp": "-3",
      "icon": "150",
      "text": "晴",
      "wind360": "353",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "22",
      "humidity": "14",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-16T21:00+08:00",
      "temp": "-3",
      "icon": "150",
      "text": "晴",
      "wind360": "355",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "20",
      "humidity": "14",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1026",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-16T22:00+08:00",
      "temp": "-4",
      "icon": "150",
      "text": "晴",
      "wind360": "356",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "18",
      "humidity": "16",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1026",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-16T23:00+08:00",
      "temp": "-4",
      "icon": "150",
      "text": "晴",
      "wind360": "356",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "18",
      "humidity": "16",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1026",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-17T00:00+08:00",
      "temp": "-4",
      "icon": "150",
      "text": "晴",
      "wind360": "354",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "16",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1027",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-17T01:00+08:00",
      "temp": "-4",
      "icon": "150",
      "text": "晴",
      "wind360": "351",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "16",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1028",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-17T02:00+08:00",
      "temp": "-4",
      "icon": "150",
      "text": "晴",
      "wind360": "350",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "16",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1028",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-17T03:00+08:00",
      "temp": "-5",
      "icon": "150",
      "text": "晴",
      "wind360": "350",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "16",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1028",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-17T04:00+08:00",
      "temp": "-5",
      "icon": "150",
      "text": "晴",
      "wind360": "351",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "15",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1027",
      "cloud": "0",
      "dew": "-28"
    },
    {
      "fxTime": "2021-02-17T05:00+08:00",
      "temp": "-5",
      "icon": "150",
      "text": "晴",
      "wind360": "352",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "14",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1026",
      "cloud": "0",
      "dew": "-29"
    },
    {
      "fxTime": "2021-02-17T06:00+08:00",
      "temp": "-5",
      "icon": "150",
      "text": "晴",
      "wind360": "355",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "14",
      "humidity": "16",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "0",
      "dew": "-27"
    },
    {
      "fxTime": "2021-02-17T07:00+08:00",
      "temp": "-7",
      "icon": "150",
      "text": "晴",
      "wind360": "359",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "20",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1024",
      "cloud": "0",
      "dew": "-26"
    },
    {
      "fxTime": "2021-02-17T08:00+08:00",
      "temp": "-5",
      "icon": "100",
      "text": "晴",
      "wind360": "1",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "14",
      "humidity": "19",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1023",
      "cloud": "0",
      "dew": "-26"
    },
    {
      "fxTime": "2021-02-17T09:00+08:00",
      "temp": "-4",
      "icon": "100",
      "text": "晴",
      "wind360": "356",
      "windDir": "北风",
      "windScale": "3-4",
      "windSpeed": "14",
      "humidity": "17",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1023",
      "cloud": "0",
      "dew": "-25"
    },
    {
      "fxTime": "2021-02-17T10:00+08:00",
      "temp": "-1",
      "icon": "100",
      "text": "晴",
      "wind360": "344",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "14",
      "humidity": "14",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1024",
      "cloud": "0",
      "dew": "-26"
    },
    {
      "fxTime": "2021-02-17T11:00+08:00",
      "temp": "0",
      "icon": "100",
      "text": "晴",
      "wind360": "333",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "14",
      "humidity": "12",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1024",
      "cloud": "0",
      "dew": "-26"
    },
    {
      "fxTime": "2021-02-17T12:00+08:00",
      "temp": "1",
      "icon": "100",
      "text": "晴",
      "wind360": "325",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "14",
      "humidity": "10",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "16",
      "dew": "-28"
    },
    {
      "fxTime": "2021-02-17T13:00+08:00",
      "temp": "2",
      "icon": "100",
      "text": "晴",
      "wind360": "319",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "8",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "32",
      "dew": "-29"
    },
    {
      "fxTime": "2021-02-17T14:00+08:00",
      "temp": "2",
      "icon": "100",
      "text": "晴",
      "wind360": "313",
      "windDir": "西北风",
      "windScale": "3-4",
      "windSpeed": "16",
      "humidity": "9",
      "pop": "0",
      "precip": "0.0",
      "pressure": "1025",
      "cloud": "48",
      "dew": "-27"
    }
  ],
  "refer": {
    "sources": [
      "QWeather",
      "NMC",
      "ECMWF"
    ],
    "license": [
      "QWeather Developers License"
    ]
  }
}
```

### 1.3 72小时天气预报

**接口**: `GET /weather/hourly/72h/{location}`

**参数**: 同24小时天气预报

**返回值**: 同24小时天气预报，但包含72小时数据

### 1.4 168小时天气预报

**接口**: `GET /weather/hourly/168h/{location}`

**参数**: 同24小时天气预报

**返回值**: 同24小时天气预报，但包含168小时数据

### 1.5 3天每日天气预报

**接口**: `GET /weather/daily/3d/{location}`

**参数**:
- `location` (必需): 位置参数
- `lang` (可选): 语言设置
- `unit` (可选): 单位设置，默认 `m` (公制)

**请求示例**:
```
GET https://api.momoweather.com/weather/daily/3d/101010100?unit=m&lang=zh
GET https://api.momoweather.com/weather/daily/3d/116.41,39.92?unit=m
```

**返回值**:
```json
{
  "code": "200",
  "updateTime": "2021-11-15T16:35+08:00",
  "fxLink": "http://hfx.link/2ax1",
  "daily": [
    {
      "fxDate": "2021-11-15",
      "sunrise": "06:58",
      "sunset": "16:59",
      "moonrise": "15:16",
      "moonset": "03:40",
      "moonPhase": "盈凸月",
      "moonPhaseIcon": "803",
      "tempMax": "12",
      "tempMin": "-1",
      "iconDay": "101",
      "textDay": "多云",
      "iconNight": "150",
      "textNight": "晴",
      "wind360Day": "45",
      "windDirDay": "东北风",
      "windScaleDay": "1-2",
      "windSpeedDay": "3",
      "wind360Night": "0",
      "windDirNight": "北风",
      "windScaleNight": "1-2",
      "windSpeedNight": "3",
      "humidity": "65",
      "precip": "0.0",
      "pressure": "1020",
      "vis": "25",
      "cloud": "4",
      "uvIndex": "3"
    }
  ],
  "refer": {
    "sources": ["QWeather", "NMC", "ECMWF"],
    "license": ["QWeather Developers License"]
  }
}
```

### 1.6 7天每日天气预报

**接口**: `GET /weather/daily/7d/{location}`

**参数**: 同3天每日天气预报

**返回值**: 同3天每日天气预报，但包含7天数据

### 1.7 10天每日天气预报

**接口**: `GET /weather/daily/10d/{location}`

**参数**: 同3天每日天气预报

**返回值**: 同3天每日天气预报，但包含10天数据

### 1.8 15天每日天气预报

**接口**: `GET /weather/daily/15d/{location}`

**参数**: 同3天每日天气预报

**返回值**: 同3天每日天气预报，但包含15天数据

### 1.9 30天每日天气预报

**接口**: `GET /weather/daily/30d/{location}`

**参数**: 同3天每日天气预报

**返回值**: 同3天每日天气预报，但包含30天数据

---

## 2. 空气质量服务

### 2.1 实时空气质量

**接口**: `GET /air-quality/realtime/{location}`

**参数**:
- `location` (必需): 位置参数
- `lang` (可选): 语言设置

**请求示例**:
```
GET https://api.momoweather.com/air-quality/realtime/101010100
GET https://api.momoweather.com/air-quality/realtime/116.41,39.92
```

**返回值**:
```json
{
  "metadata": {
    "tag": "d75a323239766b831889e8020cba5aca9b90fca5080a1175c3487fd8acb06e84"
  },
  "indexes": [
    {
      "code": "us-epa",
      "name": "AQI (US)",
      "aqi": 46,
      "aqiDisplay": "46",
      "level": "1",
      "category": "Good",
      "color": {
        "red": 0,
        "green": 228,
        "blue": 0,
        "alpha": 1
      },
      "primaryPollutant": {
        "code": "pm2p5",
        "name": "PM 2.5",
        "fullName": "Fine particulate matter (<2.5µm)"
      },
      "health": {
        "effect": "No health effects.",
        "advice": {
          "generalPopulation": "Everyone can continue their outdoor activities normally.",
          "sensitivePopulation": "Everyone can continue their outdoor activities normally."
        }
      }
    },
    {
      "code": "qaqi",
      "name": "QAQI",
      "aqi": 0.9,
      "aqiDisplay": "0.9",
      "level": "1",
      "category": "Excellent",
      "color": {
        "red": 80,
        "green": 240,
        "blue": 230,
        "alpha": 1
      },
      "primaryPollutant": {
        "code": "pm2p5",
        "name": "PM 2.5",
        "fullName": "Fine particulate matter (<2.5µm)"
      },
      "health": {
        "effect": "No health implications.",
        "advice": {
          "generalPopulation": "Enjoy your outdoor activities.",
          "sensitivePopulation": "Enjoy your outdoor activities."
        }
      }
    }
  ],
  "pollutants": [
    {
      "code": "pm2p5",
      "name": "PM 2.5",
      "fullName": "Fine particulate matter (<2.5µm)",
      "concentration": {
        "value": 11.0,
        "unit": "μg/m3"
      },
      "subIndexes": [
        {
          "code": "us-epa",
          "aqi": 46,
          "aqiDisplay": "46"
        },
        {
          "code": "qaqi",
          "aqi": 0.9,
          "aqiDisplay": "0.9"
        }
      ]
    },
    {
      "code": "pm10",
      "name": "PM 10",
      "fullName": "Inhalable particulate matter (<10µm)",
      "concentration": {
        "value": 12.0,
        "unit": "μg/m3"
      },
      "subIndexes": [
        {
          "code": "us-epa",
          "aqi": 12,
          "aqiDisplay": "12"
        },
        {
          "code": "qaqi",
          "aqi": 0.5,
          "aqiDisplay": "0.5"
        }
      ]
    },
    {
      "code": "no2",
      "name": "NO2",
      "fullName": "Nitrogen dioxide",
      "concentration": {
        "value": 6.77,
        "unit": "ppb"
      },
      "subIndexes": [
        {
          "code": "us-epa",
          "aqi": 7,
          "aqiDisplay": "7"
        },
        {
          "code": "qaqi",
          "aqi": 0.1,
          "aqiDisplay": "0.1"
        }
      ]
    },
    {
      "code": "o3",
      "name": "O3",
      "fullName": "Ozone",
      "concentration": {
        "value": 0.02,
        "unit": "ppb"
      },
      "subIndexes": [
        {
          "code": "us-epa",
          "aqi": 21,
          "aqiDisplay": "21"
        },
        {
          "code": "qaqi",
          "aqi": 0.2,
          "aqiDisplay": "0.2"
        }
      ]
    },
    {
      "code": "co",
      "name": "CO",
      "fullName": "Carbon monoxide",
      "concentration": {
        "value": 0.25,
        "unit": "ppm"
      },
      "subIndexes": [
        {
          "code": "us-epa",
          "aqi": 3,
          "aqiDisplay": "3"
        },
        {
          "code": "qaqi",
          "aqi": 0.1,
          "aqiDisplay": "0.1"
        }
      ]
    }
  ],
  "stations": [
    {
      "id": "P51762",
      "name": "North Holywood"
    },
    {
      "id": "P58056",
      "name": "Pasadena"
    },
    {
      "id": "P57327",
      "name": "Los Angeles - N. Main Street"
    }
  ]
}
```

metadata.tag 数据标签
indexes.code 空气质量指数Code
indexes.name 空气质量指数的名字
indexes.aqi 空气质量指数的值
indexes.aqiDisplay 空气质量指数的值的文本显示
indexes.level 空气质量指数等级，可能为空
indexes.category 空气质量指数类别，可能为空
indexes.color.red 空气质量指数的颜色，RGBA中的red
indexes.color.green 空气质量指数的颜色，RGBA中的green
indexes.color.blue 空气质量指数的颜色，RGBA中的blue
indexes.color.alpha 空气质量指数的颜色，RGBA中的alpah
indexes.primaryPollutant.code 首要污染物的Code，可能为空
indexes.primaryPollutant.name 首要污染物的名字，可能为空
indexes.primaryPollutant.fullName 首要污染物的全称，可能为空
indexes.health.effect 空气质量对健康的影响，可能为空
indexes.health.advice.generalPopulation 对一般人群的健康指导意见，可能为空
indexes.health.advice.sensitivePopulation 对敏感人群的健康指导意见，可能为空
pollutants.code 污染物的Code
pollutants.name 污染物的名字
pollutants.fullName 污染物的全称
pollutants.concentration.value 污染物的浓度值
pollutants.concentration.unit 污染物的浓度值的单位
pollutants.subIndexes.code 污染物的分指数的Code，可能为空
pollutants.subIndexes.aqi 污染物的分指数的数值，可能为空
pollutants.subIndexes.aqiDisplay 污染物的分指数数值的显示名称
stations.id AQI相关联的监测站Location ID，可能为空
stations.name AQI相关联的监测站名称

### 2.2 每日空气质量预报

**接口**: `GET /air-quality/daily/{location}`

**参数**: 同实时空气质量

**返回值**:
```json
{
  "metadata": {
    "tag": "4b78230843e636a6f910631d94878da73aa980a66abfcf53d35f9c06493a292d"
  },
  "days": [
    {
      "forecastStartTime": "2023-02-14T23:00Z",
      "forecastEndTime": "2023-02-15T23:00Z",
      "indexes": [
        {
          "code": "qaqi",
          "name": "QAQI",
          "aqi": 1.0,
          "aqiDisplay": "1.0",
          "level": "1",
          "category": "Excellent",
          "color": {
            "red": 195,
            "green": 217,
            "blue": 78,
            "alpha": 1
          },
          "primaryPollutant": {
            "code": "pm2p5",
            "name": "PM 2.5",
            "fullName": "Fine particulate matter (<2.5µm)"
          },
          "health": {
            "effect": "No health implications.",
            "advice": {
              "generalPopulation": "Enjoy your outdoor activities.",
              "sensitivePopulation": "Enjoy your outdoor activities."
            }
          }
        }
      ],
      "pollutants": [
        {
          "code": "pm2p5",
          "name": "PM 2.5",
          "fullName": "Fine particulate matter (<2.5µm)",
          "concentration": {
            "value": 11.88,
            "unit": "μg/m3"
          },
          "subIndexes": [
            {
              "code": "qaqi",
              "aqi": 1,
              "aqiDisplay": "1"
            }
          ]
        }
      ]
    }
  ]
}
```

### 2.3 逐小时空气质量预报

**接口**: `GET /air-quality/hourly/{location}`

**参数**: 同实时空气质量

**返回值**:
```json
{
  "metadata": {
    "tag": "b1d735802464094bf274fd2165309ddfdab22cec2fa0e644edfcd7f803c2aaad"
  },
  "hours": [
    {
      "forecastTime": "2023-05-17T03:00Z",
      "indexes": [
        {
          "code": "qaqi",
          "name": "QAQI",
          "aqi": 1.4,
          "aqiDisplay": "1.4",
          "level": "1",
          "category": "Excellent",
          "color": {
            "red": 195,
            "green": 217,
            "blue": 78,
            "alpha": 1
          },
          "primaryPollutant": {
            "code": "pm2p5",
            "name": "PM 2.5",
            "fullName": "Fine particulate matter (<2.5µm)"
          },
          "health": {
            "effect": "No health implications.",
            "advice": {
              "generalPopulation": "Enjoy your outdoor activities.",
              "sensitivePopulation": "Enjoy your outdoor activities."
            }
          }
        }
      ],
      "pollutants": [
        {
          "code": "pm2p5",
          "name": "PM 2.5",
          "fullName": "Fine particulate matter (<2.5µm)",
          "concentration": {
            "value": 17.01,
            "unit": "μg/m3"
          },
          "subIndexes": [
            {
              "code": "qaqi",
              "aqi": 1.4,
              "aqiDisplay": "1.4"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 3. 天气指数服务

### 3.1 1天天气指数预报

**接口**: `GET /indices/1d/{location}`

**参数**:
- `location` (必需): 位置参数
- `type` (必需): 指数类型，多个类型用逗号分隔
- `lang` (可选): 语言设置

**指数类型说明**:
- `1`: 运动指数
- `2`: 洗车指数
- `3`: 穿衣指数
- `4`: 感冒指数
- `5`: 紫外线指数
- `6`: 旅游指数
- `7`: 空气污染扩散条件指数
- `8`: 空调开启指数
- `9`: 过敏指数
- `10`: 太阳镜指数
- `11`: 化妆指数
- `12`: 晾晒指数
- `13`: 交通指数
- `14`: 钓鱼指数
- `15`: 防晒指数

**请求示例**:
```
GET https://api.momoweather.com/indices/1d/101010100?type=1,2,3
GET https://api.momoweather.com/indices/1d/116.41,39.92?type=1,2&lang=zh
```

**返回值**:
```json
{
  "code": "200",
  "updateTime": "2021-12-16T18:35+08:00",
  "fxLink": "http://hfx.link/2ax2",
  "daily": [
    {
      "date": "2021-12-16",
      "type": "1",
      "name": "运动指数",
      "level": "3",
      "category": "较不宜",
      "text": "天气较好，但考虑天气寒冷，风力较强，推荐您进行室内运动，若户外运动请注意保暖并做好准备活动。"
    },
    {
      "date": "2021-12-16",
      "type": "2",
      "name": "洗车指数",
      "level": "3",
      "category": "较不宜",
      "text": "较不宜洗车，未来一天无雨，风力较大，如果执意擦洗汽车，要做好蒙上污垢的心理准备。"
    }
  ],
  "refer": {
    "sources": ["QWeather"],
    "license": ["QWeather Developers License"]
  }
}
```

### 3.2 3天天气指数预报

**接口**: `GET /indices/3d/{location}`

**参数**: 同1天天气指数预报

**返回值**: 同1天天气指数预报，但包含3天数据

---

## 4. 地理位置服务

### 4.1 城市搜索

**接口**: `GET /geo/city/lookup`

**参数**:
- `location` (必需): 城市名称或坐标
- `adm` (可选): 上级行政区划
- `range` (可选): 搜索范围
- `number` (可选): 返回结果数量，默认10，最大20
- `lang` (可选): 语言设置

**请求示例**:
```
GET https://api.momoweather.com/geo/city/lookup?location=北京
GET https://api.momoweather.com/geo/city/lookup?location=beijing&number=5
```

**返回值**:
```json
{
  "code": "200",
  "location": [
    {
      "name": "北京",
      "id": "101010100",
      "lat": "39.90498",
      "lon": "116.40528",
      "adm2": "北京",
      "adm1": "北京",
      "country": "中国",
      "tz": "Asia/Shanghai",
      "utcOffset": "+08:00",
      "isDst": "0",
      "type": "city",
      "rank": "10",
      "fxLink": "http://hfx.link/2ax1"
    }
  ],
  "refer": {
    "sources": ["QWeather"],
    "license": ["QWeather Developers License"]
  }
}
```

### 4.2 热门城市

**接口**: `GET /geo/city/top`

**参数**:
- `range` (可选): 搜索范围，国家代码
- `number` (可选): 返回结果数量，默认10，最大20
- `lang` (可选): 语言设置

**请求示例**:
```
GET https://api.momoweather.com/geo/city/top?range=cn&number=10
```

**返回值**: 同城市搜索

### 4.3 POI搜索

**接口**: `GET /geo/poi/lookup`

**参数**:
- `location` (必需): 搜索关键词
- `type` (必需): POI类型 (scenic/CSTA/TSTA)
- `city` (可选): 限定城市
- `number` (可选): 返回结果数量，默认10，最大20
- `lang` (可选): 语言设置

**请求示例**:
```
GET https://api.momoweather.com/geo/poi/lookup?location=故宫&type=scenic
GET https://api.momoweather.com/geo/poi/lookup?location=天安门&type=scenic&city=北京
```

**返回值**:
```json
{
  "code": "200",
  "poi": [
    {
      "name": "故宫博物院",
      "id": "10101010018A",
      "lat": "39.91000",
      "lon": "116.39000",
      "adm2": "北京",
      "adm1": "北京",
      "country": "中国",
      "tz": "Asia/Shanghai",
      "utcOffset": "+08:00",
      "isDst": "0",
      "type": "scenic",
      "rank": "67",
      "fxLink": "https://www.qweather.com"
    }
  ],
  "refer": {
    "sources": ["QWeather"],
    "license": ["QWeather Developers License"]
  }
}
```

### 4.4 POI范围搜索

**接口**: `GET /geo/poi/range`

**参数**:
- `location` (必需): 经纬度坐标
- `type` (必需): POI类型 (scenic/CSTA/TSTA)
- `radius` (可选): 搜索半径，默认5，最大50公里
- `number` (可选): 返回结果数量，默认10，最大20
- `lang` (可选): 语言设置

**请求示例**:
```
GET https://api.momoweather.com/geo/poi/range?location=116.41,39.92&type=scenic&radius=10
```

**返回值**: 同POI搜索

### 4.5 获取LocationID

**接口**: `GET /geo/location-id`

**参数**:
- `city` (必需): 城市名称
- `adm` (可选): 上级行政区划

**请求示例**:
```
GET https://api.momoweather.com/geo/location-id?city=北京
GET https://api.momoweather.com/geo/location-id?city=朝阳&adm=北京
```

**返回值**:
```json
"101010100"
```

---

## 5. 系统接口

### 5.1 健康检查

**接口**: `GET /health`

**返回值**:
```json
{
  "status": "healthy",
  "timestamp": "2023-08-29T10:30:00Z"
}
```

### 5.2 API信息

**接口**: `GET /`

**返回值**:
```json
{
  "message": "欢迎使用天气API服务",
  "version": "2.0.0",
  "services": ["weather_forecast", "air_quality", "indices", "geo_service"],
  "endpoints": {
    "air_quality": {
      "/air-quality/daily/{location}": "GET - 获取每日空气质量预报（支持LocationID和经纬度）",
      "/air-quality/realtime/{location}": "GET - 获取实时空气质量数据（支持LocationID和经纬度）",
      "/air-quality/hourly/{location}": "GET - 获取逐小时空气质量预报（支持LocationID和经纬度）"
    },
    "indices": {
      "/indices/1d/{location}": "GET - 获取1天天气指数预报（支持LocationID和经纬度，需要type参数）",
      "/indices/3d/{location}": "GET - 获取3天天气指数预报（支持LocationID和经纬度，需要type参数）"
    },
    "weather_forecast": {
      "/weather/now/{location}": "GET - 获取实时天气数据（支持LocationID和经纬度）",
      "/weather/hourly/24h/{location}": "GET - 获取24小时逐小时天气预报（支持LocationID和经纬度）",
      "/weather/hourly/72h/{location}": "GET - 获取72小时逐小时天气预报（支持LocationID和经纬度）",
      "/weather/hourly/168h/{location}": "GET - 获取168小时逐小时天气预报（支持LocationID和经纬度）"
    },
    "geo_service": {
      "/geo/city/lookup": "GET - 城市搜索",
      "/geo/city/top": "GET - 热门城市查询",
      "/geo/poi/lookup": "GET - POI搜索",
      "/geo/poi/range": "GET - POI范围搜索",
      "/geo/location-id": "GET - 获取LocationID"
    }
  }
}
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有接口都需要有效的JWT认证
2. 请求频率限制：每分钟最多1000次请求
3. location参数支持LocationID和经纬度两种格式
4. 经纬度格式：经度在前，纬度在后，用逗号分隔
5. 所有时间均为ISO 8601格式
6. 温度单位默认为摄氏度
7. 风速单位默认为公里/小时
8. 降水量单位为毫米
9. 气压单位为百帕
10. 能见度单位为公里