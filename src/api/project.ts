import { get, post, put } from '@/utils/request'
import type { ICreateProjectApi, IDetailApi, IMembersApi, IInviteFriendsApi } from '@/api/types/project'

export const getProjectsApi = () => get('/v1/projects')

export const createProjectApi = (data: ICreateProjectApi) => post('/v1/projects/create', data)

export const getDetailApi = (data: IDetailApi) => get('/v1/projects/detail', data)

export const getMembersApi = (data: IMembersApi) => get('/v1/projects/members', data)

export const getInviteFriendsApi = (data: IInviteFriendsApi) => get('/v1/projects/members/invites', data)

export const createTaskProjectApi = (data = {}) => post('/v1/projects/tasks/create', data)

export const getProjectTasksApi = (data = {}) => get('/v1/projects/tasks', data)

export const setProjectTaskMoveApi = (data = {}) => put('/v1/projects/tasks/move', data)

export const getProjectTaskDetailApi = (data = {}) => get('/v1/projects/tasks/detail', data)

export const getTaskCoexecutorsApi = (data = {}) => get('/v1/projects/tasks/coexecutors', data)

export const getTaskWatchersApi = (data = {}) => get('/v1/projects/tasks/watchers', data)

export const getTaskCommentsApi = (data = {}) => get('/v1/projects/tasks/comments', data)

export const createTaskCommentApi = (data = {}) => post('/v1/projects/tasks/comments/create', data)
