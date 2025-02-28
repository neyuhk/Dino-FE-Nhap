//import http from '@/services/http/http'
import http from './http/http'
import httpAuth from './http/httpAuth'
import { USER_API } from '../constants/api'
import httpFile from './http/httpFile.ts'

export const getCurrentUser = async () => {
    return (await httpAuth.get(USER_API.GET_CURRENT_USER)).data
}

export const getUsers = async () => {
    return (await http.get(USER_API.GET_USERS)).data.data
}

export const getUserById = async (id: string) => {
    return (await httpAuth.get(USER_API.GET_USER_BY_ID + id)).data
}

export const updateUser = async (data: any) => {
    return (await httpFile.put(USER_API.UPDATE_USER, data)).data
}

export const changeRole = async (data: any) => {
    return (await httpAuth.put(USER_API.CHANGE_ROLE, data)).data
}
