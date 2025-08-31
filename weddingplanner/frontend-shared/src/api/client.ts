import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5155/api/v1";

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private processQueue(error: Error | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });

    this.failedQueue = [];
  }

  private setupInterceptors() {
    // Response interceptor for handling 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is not 401 or request has already been retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) return Promise.reject(error);

        // Don't retry auth endpoints
        if (originalRequest.url?.includes("/auth/")) return Promise.reject(error);

        if (this.isRefreshing) {
          // If we're already refreshing, queue this request
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then(() => this.client(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          // Try to refresh the token
          await this.refreshToken();

          // Process queued requests
          this.processQueue();

          // Retry the original request
          return this.client(originalRequest);
        } catch (refreshError) {
          // Refresh failed, process queue with error
          this.processQueue(refreshError as Error);

          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
        }
      }
    );
  }

  private async refreshToken(): Promise<void> {
    await this.client.post("/auth/web/refresh");
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<TResponse, TPayload = unknown>(
    url: string,
    data?: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    // Override Content-Type for FormData to prevent JSON serialization
    let requestConfig = config;
    if (data instanceof FormData) {
      requestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      };
    }

    const response = await this.client.post<TResponse>(url, data, requestConfig);
    return response.data;
  }

  async put<TResponse, TPayload = unknown>(
    url: string,
    data?: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.put<TResponse>(url, data, config);
    return response.data;
  }

  async patch<TResponse, TPayload = unknown>(
    url: string,
    data?: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.patch<TResponse>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T | void> {
    const response = await this.client.delete<T>(url, config);
    // Handle 204 No Content responses
    if (response.status === 204) {
      return;
    }
    return response.data;
  }
}

export default ApiClient;
