// HTTP客户端工具类
import { API_CONFIG, STATUS_CODES } from './config';
import type { ApiError } from './types';

// 请求选项接口
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}

// 响应接口
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// HTTP客户端类
export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = {
      'Accept': 'application/json',
    };
  }

  // 设置认证token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 移除认证token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // 构建URL参数
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // 构建完整URL
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint}`;
    return params ? `${url}${this.buildQueryString(params)}` : url;
  }

  // 创建AbortController用于超时控制
  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T;
    
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      throw new Error(`Failed to parse response: ${error}`);
    }

    const apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };

    if (!response.ok) {
      const apiError: ApiError = {
        code: String(response.status),
        message: response.statusText,
        details: data,
      };
      throw apiError;
    }

    return apiResponse;
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 执行请求（带重试机制）
  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    retries: number = API_CONFIG.RETRY_CONFIG.maxRetries
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options);
      return await this.handleResponse<T>(response);
    } catch (error) {
      // 如果是AbortError（超时），不重试
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      // 如果还有重试次数，则重试
      if (retries > 0) {
        await this.delay(API_CONFIG.RETRY_CONFIG.retryDelay);
        return this.executeRequest<T>(url, options, retries - 1);
      }

      // 重试次数用完，抛出错误
      throw error;
    }
  }

  // 通用请求方法
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      params,
      timeout = this.timeout,
      retries = API_CONFIG.RETRY_CONFIG.maxRetries,
    } = options;

    const url = this.buildURL(endpoint, params);
    const controller = this.createAbortController(timeout);

    const requestOptions: RequestInit = {
      method,
      mode: 'cors',
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await this.executeRequest<T>(url, requestOptions, retries);
      return response.data;
    } catch (error) {
      // 统一错误处理
      if (error instanceof Error) {
        console.error(`API Request failed: ${method} ${url}`, error.message);
      }
      throw error;
    }
  }

  // GET请求
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: Omit<RequestOptions, 'method' | 'params'>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
      params,
    });
  }

  // POST请求
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        ...options?.headers,
      },
    });
  }

  // PUT请求
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
    });
  }

  // DELETE请求
  async delete<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// 创建默认的HTTP客户端实例
export const httpClient = new HttpClient();

// 导出便捷方法
export const api = {
  get: httpClient.get.bind(httpClient),
  post: httpClient.post.bind(httpClient),
  put: httpClient.put.bind(httpClient),
  delete: httpClient.delete.bind(httpClient),
  setAuthToken: httpClient.setAuthToken.bind(httpClient),
  removeAuthToken: httpClient.removeAuthToken.bind(httpClient),
};