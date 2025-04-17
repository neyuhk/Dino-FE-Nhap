import axios, { AxiosInstance } from 'axios'
import { LOCAL_STORAGE_KEYS } from '../../constants/localStorageKey.ts'
import store from '../../stores'
import { refreshTokenAction } from '../../stores/authAction.ts'
import { logout } from '../../stores/authSlice.ts'

// Tạo instance httpAuth
const httpAuth: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_APP_ROOT_API,
    transformRequest: [
        (data) => {
            // Chuyển đổi dữ liệu thành JSON trước khi gửi
            return JSON.stringify(data);
        },
    ],
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tạo instance httpFile
const httpFile: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_APP_ROOT_API,
    headers: {
        'Content-Type': 'multipart/form-data', // Dành cho upload file
    },
});

// Hàm interceptor chung để thêm token
const addTokenInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Xử lý response để refresh token nếu cần
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    console.log('bd tim')
                    await store.dispatch(refreshTokenAction())
                    return instance(originalRequest)
                } catch (refreshError) {
                    store.dispatch(logout()); // Đăng xuất nếu refresh token thất bại
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};

// Áp dụng interceptor cho cả hai instance
addTokenInterceptor(httpAuth);
addTokenInterceptor(httpFile);

export { httpAuth, httpFile };
