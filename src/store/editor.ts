import { defineStore } from 'pinia'
import { collectStickerApi, deleteStickerApi, getStickerListApi, uploadStickerApi } from '@/api/chat'
import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

interface IItems {
  name: string
  icon: string
  children?: any
}

interface ISticker {
  items: IItems[]
}

interface IEditorState {
  sticker: ISticker
}

export const useEditorStore = defineStore('editor', {
  state: (): IEditorState => ({
    sticker: {
      items: [
        {
          name: i18n('emoji'),
          icon: 'data:image/svg+xml;base64,PHN2ZyBpZD0iRmxhdCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+CiAgPHBhdGggZD0iTTEyOCwyNGExMDQsMTA0LDAsMSwwLDMwLjU2NTQzLDIwMy40MzM1OSw3Ljk5NjgzLDcuOTk2ODMsMCwwLDAsMy4zMDg1OS0xLjk5MDcybDYzLjU3MDMyLTYzLjU3MzI0YTcuOTk1NDgsNy45OTU0OCwwLDAsMCwxLjk5MDcyLTMuMzA4NTlBMTA0LjA3NTU5LDEwNC4wNzU1OSwwLDAsMCwxMjgsMjRabTM2LDcyYTEyLDEyLDAsMSwxLTEyLDEyQTEyLDEyLDAsMCwxLDE2NCw5NlpNOTIsOTZhMTIsMTIsMCwxLDEtMTIsMTJBMTIsMTIsMCwwLDEsOTIsOTZabTg0LjUwMjkzLDYwLjAwMjQ0YTU2LjE5NjA3LDU2LjE5NjA3LDAsMCwxLTI2LjcwMjY0LDIzLjU4OTM2LDU2LjA1NjkzLDU2LjA1NjkzLDAsMCwxLTcwLjMwMzIyLTIzLjU4ODYzLDguMDAwMTEsOC4wMDAxMSwwLDAsMSwxMy44NDk2MS04LjAxMjIsNDAuMTkzNTIsNDAuMTkzNTIsMCwwLDAsMTkuMDg1OTQsMTYuODY1NDgsMzkuOTU5NTMsMzkuOTU5NTMsMCwwLDAsNDMuODUxNTYtOC41NzYxOCw0MC4xODcxNSw0MC4xODcxNSwwLDAsMCw2LjM2OTE0LTguMjg5NzksOC4wMDAwNSw4LjAwMDA1LDAsMSwxLDEzLjg0OTYxLDguMDEyWiIvPgo8L3N2Zz4K'
        },
        {
          name: i18n('stickers'),
          icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiIHdpZHRoPSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTUuMTExMTExMSAyYzEuNTk1NDg5MyAwIDIuODg4ODg4OSAxLjI5MzM5OTYxIDIuODg4ODg4OSAyLjg4ODg4ODg5djYuMTExMTExMTFsLTQuMjIxMTkyMi4wMDA4ODg5LS4xODk0NC4wMDYxNjI3Yy0xLjA2NDYwMjguMDY5MTg2MS0xLjg2MDg5NTkuNjAyODE3Ny0yLjMwMTcyNjQgMS41MTY3NjQ2LS4wNTE4NDgyLjA5OTUyNjMtLjA5NjY2NjUuMjA2NzM3Mi0uMTM0NDU1LjMyMTYzMjctMS40ODUwMDc1Ny40MDE4NDIzLTMuMTM3NDIyNTEuMDE0Njk1Ni00LjI5ODA4MjM1LTEuMTU2MjEyOC0uMTk0NDAxOTgtLjE5NjExODUtLjUxMDk4MTQxLS4xOTc1MS0uNzA3MDk5OTUtLjAwMzEwODEtLjE5NjExODUzLjE5NDQwMi0uMTk3NTEwMDcuNTEwOTgxNS0uMDAzMTA4MDkuNzA3MSAxLjMxNjA4NDI3IDEuMzI3NzA1MiAzLjE0Nzk2Mjg2IDEuODMzMzM0OSA0Ljg1Njg2MTQ5IDEuNTE0MDgxNWwtLjAwMTc1NzUgNC4wOTI2OTA1aC02LjExMTExMTExYy0xLjU5NTQ4OTI4IDAtMi44ODg4ODg4OS0xLjI5MzM5OTYtMi44ODg4ODg4OS0yLjg4ODg4ODl2LTEwLjIyMjIyMjIxYzAtMS41OTU0ODkyOCAxLjI5MzM5OTYxLTIuODg4ODg4ODkgMi44ODg4ODg4OS0yLjg4ODg4ODg5em0yLjg4ODg4ODkgMTAuMDAwNzQzN2MtLjA1ODY0NjMuMDc2MjE4My0uMTIyNDU1NS4xNDg5NzQ3LS4xOTExOTk1LjIxNzcxODdsLTUuNTkwNDE5NiA1LjU5MDQxOTZjLS4wNjg0NDUxLjA2ODQ0NTEtLjE0MDg2NzguMTMxOTk4Mi0uMjE2NzI0Ny4xOTA0MzQybC0uMDAwOTY5NC00LjI1ODgyMDguMDA1ODI5Ny0uMTQyNzE2OGMuMDY4OTE5Ni0uODQ0NjA3Ljc0MDgyNzUtMS41MTg3OTY0IDEuNTg0NTU0NC0xLjU5MTMxNDdsLjE1MDU4ODgtLjAwNjQ2Mzl6bS0xMS01LjAwMDc0MzdjLS41NTIyODQ3NSAwLTEgLjQ0NzcxNTI1LTEgMXMuNDQ3NzE1MjUgMSAxIDEgMS0uNDQ3NzE1MjUgMS0xLS40NDc3MTUyNS0xLTEtMXptNiAwYy0uNTUyMjg0NyAwLTEgLjQ0NzcxNTI1LTEgMXMuNDQ3NzE1MyAxIDEgMSAxLS40NDc3MTUyNSAxLTEtLjQ0NzcxNTMtMS0xLTF6IiBmaWxsPSIjMjEyMTIxIi8+PC9zdmc+',
          children: []
        }
      ]
    }
  }),
  actions: {
    loadUserSticker() {
      getStickerListApi()
        .then(({ code, data }: any) => {
          if (code == 200) {
            const { collect_sticker } = data
            this.sticker.items[1].children = collect_sticker || []
          }
        })
    },

    saveUserSticker(resoure: any) {
      collectStickerApi({
        record_id: resoure.record_id
      })
        .then(({ code, message }: any) => {
          if (code == 200) {
            this.loadUserSticker()
          } else {
            ElMessage.warning(message)
          }
        })
    },

    uploadUserSticker(file: any) {
      const data = new FormData()
      data.append('sticker', file)
      uploadStickerApi(data)
        .then(({ code, data, message }: any) => {
          if (code == 200) {
            this.sticker.items[1].children.unshift(data)
          } else {
            ElMessage.warning(message)
          }
        })
    },

    removeUserSticker(resoure: any) {
      deleteStickerApi({
        ids: [resoure.id].join(',')
      }).then(({ code, message }: any) => {
        if (code == 200) {
          this.sticker.items[1].children.splice(resoure.index, 1)
          ElMessage.success(i18n('success'))
        } else {
          ElMessage.warning(message)
        }
      })
    }
  }
})
