// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { defineStore } from 'pinia'
import { getTaskCommentsApi } from '@/api/project'
import { formatTaskCommentItem } from '@/utils/project'

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
      }).then(({ data, code }: any) => {
        if (code == 200 && data) {
          this.comments = data.items.map((item: any) => formatTaskCommentItem(item))
        }
      })
    },

    updateCommentItem(params: any) {
      const item = this.comments.find((item: any) => item.index_name === params.index_name)
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
