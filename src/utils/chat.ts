import { useChatStore } from '@/store'
import router from '@/router'
import { parseTime } from '@/utils/datetime'
import { createChatApi, deleteChatApi, setNotDisturbApi } from '@/api/chat'
import { KEY_INDEX_NAME } from '@/constants/chat'
import { useMessageStore } from '@/store'
import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

export const formatRecord = (uid: any, data: any) => {
  data.float = 'center'
  if (data.user_id > 0) {
    data.float = data.user_id == uid ? 'right' : 'left'
  }
  data.isCheck = false
  return data
}

export const palyMusic = (muted = false) => {
  const audio = document.getElementById('audio') as HTMLAudioElement | null
  if (audio) {
    audio.currentTime = 0
    audio.muted = muted
    audio.play().catch(err => {
      console.log(i18n('invalidPushSubscription', { err: err }))
    })
  }
}

export const findChatIndex = (index_name: any) => {
  return useChatStore().items.findIndex((item: any) => item.index_name === index_name)
}

export const findChat = (index_name: any) => {
  return useChatStore().items.find((item: any) => item.index_name === index_name)
}

export const formatMessageItem = (params: any) => {
  const options = {
    id: 0,
    chat_type: 1,
    receiver_id: 0,
    name: i18n('nameNotProvided'),
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
  options.index_name = `${options.chat_type}_${options.receiver_id}`
  return options
}

export const onSetDisturb = (data: any) => {
  setNotDisturbApi({
    chat_type: data.chat_type,
    receiver_id: data.receiver_id,
    is_disturb: data.is_disturb == 0 ? 1 : 0
  }).then(({ code, message }: any) => {
    if (code == 200) {
      useChatStore().updateItem({
        index_name: data.index_name,
        is_disturb: data.is_disturb == 0 ? 1 : 0
      })
    } else {
      ElMessage.error(message)
    }
  })
}

export const toChat = (chat_type: any, receiver_id: any) => {
  if (findChatIndex(`${chat_type}_${receiver_id}`) >= 0) {
    sessionStorage.setItem(KEY_INDEX_NAME, `${chat_type}_${receiver_id}`)
    return router.push({
      path: '/messages',
      query: { v: new Date().getTime() }
    })
  }
  createChatApi({
    chat_type: parseInt(chat_type),
    receiver_id: parseInt(receiver_id)
  }).then(({ code, data, message }: any) => {
    if (code == 200) {
      sessionStorage.setItem(KEY_INDEX_NAME, `${chat_type}_${receiver_id}`)
      if (findChatIndex(`${chat_type}_${receiver_id}`) === -1) {
        useChatStore().addItem(formatMessageItem(data))
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

export const onChatDelete = (index_name = '') => {
  useChatStore().delItem(index_name)
  index_name === useMessageStore().index_name && useMessageStore().$reset()
}

export const onChatRemove = (data: any) => {
  deleteChatApi({
    list_id: data.id
  }).then(({ code }: any) => {
    if (code == 200) {
      onChatDelete(data.index_name)
    }
  })
}
