import { ApiResponse } from 'weddingplanner-types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3070/api';

class ApiClient {
    private client: AxiosInstance;
    private baseURL: string;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
    }> = [];

    constructor(baseURL: string = API_URL) {
        this.baseURL = baseURL;

        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private processQueue(error: Error | null = null) {
        this.failedQueue.forEach(prom => {
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
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // If error is not 401 or request has already been retried, reject
                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error);
                }

                // On any 401, immediately clear the auth cache
                if (typeof window !== 'undefined') {
                    const queryClient = (window as any).__REACT_QUERY_CLIENT__;
                    if (queryClient) {
                        queryClient.removeQueries({ queryKey: ['auth', 'user'] });
                    }
                }

                // Don't retry auth endpoints
                if (originalRequest.url?.includes('/auth/')) {
                    return Promise.reject(error);
                }

                if (this.isRefreshing) {
                    // If we're already refreshing, queue this request
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    }).then(() => {
                        return this.client(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
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

                    // Clear auth state and redirect to login
                    if (typeof window !== 'undefined') {
                        const queryClient = (window as any).__REACT_QUERY_CLIENT__;
                        if (queryClient) {
                            queryClient.clear();
                        }

                        window.location.href = '/login';
                    }

                    return Promise.reject(refreshError);
                } finally {
                    this.isRefreshing = false;
                }
            }
        );
    }

    private async refreshToken(): Promise<void> {
        try {
            // Call the refresh endpoint
            // This will automatically use the refresh-token cookie
            await this.client.post('/auth/refresh-web');
        } catch (error) {
            throw error;
        }
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.put<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(url, config);
        // Handle 204 No Content responses
        if (response.status === 204) {
            return {
                success: true,
                data: null as T,
                statusCode: 204,
                error: null
            };
        }
        return response.data;
    }
}

export default ApiClient;