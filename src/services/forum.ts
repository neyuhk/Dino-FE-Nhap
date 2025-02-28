import http from '@/services/http/http'
import httpFile from './http/http/httpFile.ts'
import { COURSE_API, FORUM_API } from '../constants/api.ts'

export const getForums = async () => {
    return (await http.get(FORUM_API.GET_FORUMS)).data
}

export const getForumsBaseOnUserId = async (id:string) => {
    return (await http.get(FORUM_API.GET_FORUMS_BASE_ON_USERID + id)).data
}

export const deleteForum = async (id: string) => {
    return await http.delete(FORUM_API.DELETE_FORUM + id);
}

export const getForumById = async (id: string) => {
    return (await http.get(FORUM_API.GET_FORUM_BY_ID + id)).data
}

export const likePost = async (forumId: string, userId: string) => {
    return (await http.post(FORUM_API.LIKE , {forumId, userId})).data
}

export const repost = async (forumId: string, userId: string) => {
    return (await http.post(FORUM_API.REPOST , {forumId, userId})).data
}

