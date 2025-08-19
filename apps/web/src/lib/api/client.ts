import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const getBaseURL = (): string => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://localhost:3001/api';
  }

  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers.get('Cache-Control')) {
      config.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      config.headers.set('Pragma', 'no-cache');
      config.headers.set('Expires', '0');
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data as unknown;

    const errorData = {
      status: status || 0,
      message:
        ((responseData as Record<string, unknown>)?.message as string) ||
        error.message ||
        '알 수 없는 오류가 발생했습니다.',
      code:
        ((responseData as Record<string, unknown>)?.code as string) ||
        error.code ||
        'UNKNOWN_ERROR',
      details: (responseData as Record<string, unknown>)?.details || null,
    };

    error.response = {
      ...error.response,
      data: errorData,
    } as any;

    return Promise.reject(error);
  }
);

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },

  upload: <T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      timeout: 30000,
    });
  },
};

export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
};

export const isNetworkError = (error: any): boolean => {
  return !error?.response && error?.code === 'ERR_NETWORK';
};

export const isTimeoutError = (error: any): boolean => {
  return error?.code === 'ECONNABORTED' || error?.message?.includes('timeout');
};

export const isStatusError = (error: any, status: number): boolean => {
  return error?.response?.status === status;
};

export default apiClient;
