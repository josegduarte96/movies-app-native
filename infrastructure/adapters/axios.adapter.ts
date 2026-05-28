import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '@/core/adapters/http.adapter';

interface Options {
  baseURL: string;
  params?: Record<string, string>;
}

export class AxiosAdapter extends HttpAdapter {
  private axiosInstance: AxiosInstance;

  constructor(options: Options) {
    super();
    this.axiosInstance = axios.create({
      baseURL: options.baseURL,
      params: options.params,
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const fullURL = (config.baseURL ?? '') + (config.url ?? '');
      config.params = { ...config.params, language: 'es-AR' };
      console.log('[AxiosAdapter] →', config.method?.toUpperCase(), fullURL, {
        ...config.params,
        api_key: config.params?.api_key ? '***SET***' : '***MISSING***',
      });
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('[AxiosAdapter] ←', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.log(JSON.stringify(error, null, 2));
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.get<T>(url, options);
    return data;
  }

  async post<T>(url: string, body: unknown, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.post<T>(url, body, options);
    return data;
  }

  async put<T>(url: string, body: unknown, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.put<T>(url, body, options);
    return data;
  }

  async delete<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.delete<T>(url, options);
    return data;
  }
}
