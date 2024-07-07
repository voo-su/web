import { useDialogStore } from '@/store'
import router from '@/router'
import { parseTime } from '@/utils/datetime'
import { createChatApi, delChatApi, setNotDisturbApi } from '@/api/chat'
import { KEY_INDEX_NAME } from '@/constants/dialog'
import { useDialogueStore } from '@/store'
import { ElMessage } from 'element-plus'

export const formatDialogRecord = (uid: any, data: any) => {
  data.float = 'center'
  if (data.user_id > 0) {
    data.float = data.user_id == uid ? 'right' : 'left'
  }
  data.isCheck = false
  return data
}

export const palyMusic = (muted = false) => {
  const audio: any = document.getElementById('audio')
  audio.currentTime = 0
  audio.muted = muted
  audio.play()
}

export const findDialogIndex = (index_name: any) => {
  return useDialogStore().items.findIndex((item: any) => item.index_name === index_name)
}

export const findDialog = (index_name: any) => {
  return useDialogStore().items.find((item: any) => item.index_name === index_name)
}

export const formatDialogItem = (params: any) => {
  const options = {
    id: 0,
    dialog_type: 1,
    receiver_id: 0,
    name: 'Не указано имя',
    // remark_name: '',
    avatar: '',
    is_disturb: 0,
    is_top: 0,
    is_online: 0,
    is_bot: 0,
    unread_num: 0,
    content: '......',
    draft_text: '',
    msg_text: '',
    index_name: '',
    created_at: parseTime(new Date())
  }
  Object.assign(options, params)
  options.msg_text = options.msg_text
  options.index_name = `${options.dialog_type}_${options.receiver_id}`
  return options
}

export const onSetDisturb = (data: any) => {
  setNotDisturbApi({
    dialog_type: data.dialog_type,
    receiver_id: data.receiver_id,
    is_disturb: data.is_disturb == 0 ? 1 : 0
  }).then(({
             code,
             message
           }: any) => {
    if (code == 200) {
      // ElMessage.success('Успешно установлено')

      useDialogStore().updateItem({
        index_name: data.index_name,
        is_disturb: data.is_disturb == 0 ? 1 : 0
      })
    } else {
      ElMessage.error(message)
    }
  })
}

export const toDialog = (dialog_type: any, receiver_id: any) => {
  if (findDialogIndex(`${dialog_type}_${receiver_id}`) >= 0) {
    sessionStorage.setItem(KEY_INDEX_NAME, `${dialog_type}_${receiver_id}`)
    return router.push({
      path: '/messages',
      query: { v: new Date().getTime() }
    })
  }
  createChatApi({
    dialog_type: parseInt(dialog_type),
    receiver_id: parseInt(receiver_id)
  }).then((res: any) => {
    const { code, data, message } = res
    
    if (code == 200) {
      sessionStorage.setItem(KEY_INDEX_NAME, `${dialog_type}_${receiver_id}`)
      if (findDialogIndex(`${dialog_type}_${receiver_id}`) === -1) {
        useDialogStore().addItem(formatDialogItem(data))
      }
      router.push({
        path: '/messages',
        query: { v: new Date().getTime() }
      })
    } else {
      ElMessage.info(message)
    }
  })
}

export const getCacheIndexName = () => {
  const index_name = sessionStorage.getItem(KEY_INDEX_NAME)
  if (index_name) {
    sessionStorage.removeItem(KEY_INDEX_NAME)
  }
  return index_name
}

export const setCacheIndexName = (type: any, id: any) => {
  sessionStorage.setItem(KEY_INDEX_NAME, `${type}_${id}`)
}

const onDeleteDialog = (index_name = '') => {
  useDialogStore().delItem(index_name)
  index_name === useDialogueStore().index_name && useDialogueStore().$reset()
}

export const onRemoveDialog = (data: any) => {
  delChatApi({
    list_id: data.id
  }).then(({ code }: any) => {
    if (code == 200) {
      onDeleteDialog(data.index_name)
    }
  })
}
