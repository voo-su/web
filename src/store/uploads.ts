import { defineStore } from 'pinia'

import { fileSubareaUploadApi, findFileSplitInfoApi } from '@/api/upload'
import { sendDialogFileApi } from '@/api/message'

const fileSlice = (file, uploadId, eachSize) => {
  const splitNum = Math.ceil(file.size / eachSize)
  const items = []
  for (let i = 0; i < splitNum; i++) {
    const start = i * eachSize
    const end = Math.min(file.size, start + eachSize)
    const form = new FormData()
    form.append('file', file.slice(start, end))
    form.append('upload_id', uploadId)
    form.append('split_index', i)
    form.append('split_num', splitNum)
    items.push(form)
  }
  return items
}

export const useUploadsStore = defineStore('uploads', {
  state: () => {
    return {
      isShow: false,
      items: []
    }
  },
  actions: {
    close() {
      this.isShow = false
    },

    initUploadFile(file, dialogType, receiverId, username) {
      findFileSplitInfoApi({
        file_name: file.name,
        file_size: file.size
      }).then((res: any) => {
        const {
          code,
          data,
          message
        } = res
        if (code == 200) {
          const {
            upload_id,
            split_size
          } = data
          this.items.unshift({
            file: file,
            dialog_type: dialogType,
            receiver_id: receiverId,
            upload_id: upload_id,
            uploadIndex: 0,
            percentage: 0,
            status: 0,
            files: fileSlice(file, upload_id, split_size),
            avatar: '',
            username: username
          })
          this.triggerUpload(upload_id)
          this.isShow = true
        } else {
          window['$message'].error(message)
        }
      })
    },

    findItem(uploadId) {
      return this.items.find(item => item.upload_id === uploadId)
    },

    triggerUpload(uploadId) {
      const item = this.findItem(uploadId)
      const form = item.files[item.uploadIndex]
      item.status = 1
      fileSubareaUploadApi(form)
        .then((res: any) => {
          const { code } = res
          if (code == 200) {
            item.uploadIndex++
            if (item.uploadIndex === item.files.length) {
              item.status = 2
              item.percentage = 100
              this.sendUploadMessage(item)
            } else {
              const percentage = (item.uploadIndex / item.files.length) * 100
              item.percentage = percentage.toFixed(1)
              this.triggerUpload(uploadId)
            }
          } else {
            item.status = 3
          }
        })
        .catch(() => {
          item.status = 3
        })
    },

    sendUploadMessage(item) {
      sendDialogFileApi({
        upload_id: item.upload_id,
        receiver_id: item.receiver_id,
        dialog_type: item.dialog_type
      })
    }
  },
  getters: {
    successCount: state => {
      return state.items.filter(item => {
        return item.status === 2
      }).length
    }
  }
})
