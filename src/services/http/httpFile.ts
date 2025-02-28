import axios from 'axios'
import { LOCAL_STORAGE_KEYS } from '../../constants/localStorageKey.ts'
import store from '../../stores'
import { refreshTokenAction } from '../../stores/authAction.ts'
import { logout } from '../../stores/authSlice.ts'
import httpAuth from './httpAuth.ts'

const httpFile = axios.create({
    withCredentials: true,
    // @ts-ignore
    baseURL: import.meta.env.VITE_APP_ROOT_API,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

httpFile.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

httpFile.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                console.log('bd tim')
                await store.dispatch(refreshTokenAction())
                return httpAuth(originalRequest)
            } catch (err) {
                await store.dispatch(logout())
                return Promise.reject(err)
            }
        }
        return Promise
    }
)

export default httpFile
