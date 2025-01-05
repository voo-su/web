import { defineStore } from 'pinia'
import { getTaskCommentsApi } from '@/api/project'
import { formatTaskCommentItem } from '@/utils/project'
import type { ICommentItem } from '@/components/project/types'

export const useProjectStore = defineStore('project', {
  state: () => {
    return {
      items: [],
      comments: []
    }
  },
  actions: {
    addItems(items) {
      this.items = items
    },

    loadTaskComments(taskId: number) {
      getTaskCommentsApi({
        task_id: taskId
      }).then(({ code, data }: { code?: number; data: { items: ICommentItem[] } })=> {
        if (code == 200 && data.items) {
          if (data.items) {
            this.comments = data.items.map((item: ICommentItem) => formatTaskCommentItem(item))
          }
        }
      })
    },

    updateCommentItem(params: any) {
      const item = this.comments.find((item: ICommentItem) => item.index_name === params.index_name)
      item && Object.assign(item, params)
    }
  },
  getters: {
    getItems: state => {
      return state.items
    },

    getTypes: state => {
      return state.items.map(item => {
        return {
          id: item.id,
          title: item.title
        }
      })
    },

    getComments: state => {
      return state.comments
    }
  }
})
