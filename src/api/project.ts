import { get } from '@/utils/request'

export const getProjectListApi = () => get('/v1/projects')
