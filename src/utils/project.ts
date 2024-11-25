import { parseTime } from './datetime'

export const formatTaskCommentItem = (params: any) => {
  const options = {
    id: 0,
    task_id: 0,
    comment: '',
    user: {
      id: 0,
      username: ''
    },
    created_at: parseTime(new Date()),
    index_name: ''
  }
  Object.assign(options, params)
  options.index_name = `${options.task_id}_${options.user.id}`
  return options
}
