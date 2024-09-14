import { get, post } from '@/utils/request'

export const getProjectsApi = () => get('/v1/projects')

export const createProjectApi = (data = {}) => post('/v1/projecs/create', data)

export const createTaskProjectApi = (data = {}) => post('/v1/projects/tasks/create', data)

export const getProjectTasksApi = (data = {}) => get('/v1/projects/tasks', data)
