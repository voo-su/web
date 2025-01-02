// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { defineStore } from 'pinia'

import { fileSubareaUploadApi, findFileSplitInfoApi } from '@/api/upload'
import { messageSendApi } from '@/api/message'
import { ElMessage } from 'element-plus'

const fileSlice = (file: File, uploadId: string, eachSize: number) => {
  const splitNum = Math.ceil(file.size / eachSize)
  const items: FormData[] = []
  for (let i = 0; i < splitNum; i++) {
    const start = i * eachSize
    const end = Math.min(file.size, start + eachSize)

    const form = new FormData()
    form.append('file', file.slice(start, end))
    form.append('upload_id', uploadId)
    form.append('split_index', `${i + 1}`)
    form.append('split_num', `${splitNum}`)

    items.push(form)
  }

  return items
}

interface IUploads {
  isShow: boolean
  items: any
}

export const useUploadsStore = defineStore('uploads', {
  state: (): IUploads => {
    return {
      isShow: false,
      items: []
    }
  },

  actions: {
    async initUploadFile(file: File, dialogType: number, receiverId: number, username: string) {
      findFileSplitInfoApi({
        file_name: file.name,
        file_size: file.size
      }).then(({ code, data, message }: any) => {
        if (code !== 200) throw new Error('Не удалось найти информацию о разделении файла.')

        const { upload_id, shard_size } = data

        this.items.unshift({
          file: file,
          dialog_type: dialogType,
          receiver_id: receiverId,
          upload_id: upload_id,
          uploadIndex: 0,
          percentage: 0,
          status: 0,
          files: fileSlice(file, upload_id, shard_size),
          avatar: '',
          username: username
        })

        this.triggerUpload(upload_id)
        this.isShow = true
      })
    },

    findItem(uploadId: any) {
      return this.items.find((item: any) => item.upload_id === uploadId)
    },

    triggerUpload(uploadId: any) {
      const item: any = this.findItem(uploadId)
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

    sendUploadMessage(item: any) {
      messageSendApi({
        type: 'file',
        receiver: {
          dialog_type: item.dialog_type,
          receiver_id: item.receiver_id
        },
        upload_id:  item.upload_id,
      })
        .then(({ code, message }: any) => {
          if (code == 200) {
            console.log(message)
          } else {
            ElMessage.warning(message)
          }
        })
        .catch(() => {
          ElMessage.warning('Сеть перегружена, пожалуйста, попробуйте позже')
        })
    },

    close() {
      this.isShow = false
    }
  },

  getters: {
    successCount: state => {
      return state.items.filter((item: any) => {
        return item.status === 2
      }).length
    }
  }
})
