import { get, post } from '@/utils/request'

export const getProjectListApi = () => get('/v1/projects')
export const createProjectApi = (data = {}) => post('/v1/projects/create', data)
