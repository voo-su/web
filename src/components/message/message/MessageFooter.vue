<script lang="ts" setup>
import { onMounted } from 'vue'
import { useDialogStore, useDialogueStore, useNotifyStore, useUploadsStore } from '@/store'
import { useEditorStore } from '@/store/editor'
import socket from '@/utils/socket'
import { publishMessageApi, sendDialogImageApi, sendVoteApi } from '@/api/message'
import { getVideoImage, throttle } from '@/utils/common'
import Editor from '@/components/message/editor/Editor.vue'
// import MultiSelectFooter from './MessageMultiSelectFooter.vue'
import { uploadImageApi } from '@/api/upload'
import { ElMessage } from 'element-plus'

const props = defineProps({
  uid: {
    type: Number,
    default: 0
  },
  dialog_type: {
    type: Number,
    default: 0
  },
  receiver_id: {
    type: Number,
    default: 0
  },
  index_name: {
    type: String,
    default: ''
  },
  online: {
    type: Boolean,
    default: false
  },
  members: {
    default: () => []
  }
})

const dialogStore = useDialogStore()
const editorStore = useEditorStore()
const notifyStore = useNotifyStore()
const uploadsStore = useUploadsStore()
const dialogueStore = useDialogueStore()

const onSendMessage = (data = {}, callBack: any) => {
  let message = {
    ...data,
    receiver: {
      receiver_id: props.receiver_id,
      dialog_type: props.dialog_type
    }
  }
  publishMessageApi(message)
    .then((res: any) => {
      const {
        code,
        message
      } = res
      if (code == 200) {
        callBack(true)
      } else {
        ElMessage.warning(message)
      }
    })
    .catch(() => {
      ElMessage.warning('Сеть перегружена, пожалуйста, попробуйте позже')
    })
}

const onSendTextEvent = throttle((value: any) => {
  let {
    data,
    callBack
  } = value
  let message = {
    type: 'text',
    content: data.items[0].content,
    quote_id: String(data.quoteId),
    mention: {
      all: data.mentions.find((v: any) => v.atid == 0) ? 1 : 0,
      uids: data.mentionUids
    }
  }
  onSendMessage(message, (ok: boolean) => {
    if (!ok) return

    dialogStore.updateItem({
      index_name: props.index_name,
      draft_text: ''
    })

    let el = document.getElementById('dialog-session-list')
    if (el) {
      el.scrollTop = 0
    }

    callBack(true)
  })
}, 1000)

const onSendImageEvent = ({ data, callBack }: any) => {
  onSendMessage({ type: 'image', ...data }, callBack)
}

const onSendVideoEvent = async ({ data }: any) => {
  let resp: any = await getVideoImage(data)
  const coverForm = new FormData()
  coverForm.append('file', resp.file)

  let cover: any = await uploadImageApi(coverForm)
  if (cover.code != 200) return

  const form = new FormData()
  form.append('file', data)
  
  let video: any = await uploadImageApi(form)
  if (video.code != 200) return

  let message = {
    type: 'video',
    url: video.data.src,
    cover: cover.data.src,
    duration: parseInt(resp.duration),
    size: data.size
  }

  onSendMessage(message, () => {
  })
}


const onSendAudioEvent = ({ data }: any) => {
  let maxsize = 200 * 1024 * 1024
  if (data.size > maxsize) {
    return ElMessage.warning('Файлы размером более 100 МБ нельзя загружать')
  }
  uploadsStore.initUploadFile(
    data,
    props.dialog_type,
    props.receiver_id,
    dialogueStore.dialog.username
  )
}

const onSendFileEvent = ({ data }: any) => {
  let maxsize = 200 * 1024 * 1024
  if (data.size > maxsize) {
    return ElMessage.warning('Файлы размером более 100 МБ нельзя загружать')
  }
  uploadsStore.initUploadFile(
    data,
    props.dialog_type,
    props.receiver_id,
    dialogueStore.dialog.username
  )
}

const onSendVoteEvent = ({ data, callBack }: any) => {
  sendVoteApi({
    receiver_id: props.receiver_id,
    mode: data.mode,
    anonymous: data.anonymous,
    title: data.title,
    options: data.options
  })
    .then((res: any) => {
      const {
        code,
        message
      } = res
      if (code == 200) {
        callBack(true)
      } else {
        ElMessage.warning(message)
      }
    })
    .catch(() => callBack(false))
}

const onSendStickerEvent = ({ data, callBack }: any) => {
  onSendMessage({
    type: 'sticker',
    sticker_id: data
  }, callBack)
}

const onSendMixedEvent = ({ data, callBack }: any) => {
  let message = {
    type: 'mixed',
    quote_id: data.quoteId,
    items: data.items
  }
  onSendMessage(message, callBack)
}

const onKeyboardPush = throttle(() => {
  socket.emit('voo.message.keyboard', {
    sender_id: props.uid,
    receiver_id: props.receiver_id
  })
}, 3000)

const onInputEvent = ({ data }: any) => {
  dialogStore.updateItem({
    index_name: props.index_name,
    draft_text: data
  })
  if (notifyStore.isKeyboard && props.online) {
    onKeyboardPush()
  }
}

const onSendImageAttachEvent = ({ data, callBack }: any) => {
  let fileData = new FormData()
  fileData.append('dialog_type', props.dialog_type)
  fileData.append('receiver_id', props.receiver_id)
  fileData.append('image', data)

  const resp = sendDialogImageApi(fileData)
  resp.then((res: any) => {
    const {
      code,
      message
    } = res
    if (code == 200) {
      callBack(true)
    } else {
      ElMessage.info(message)
    }
  })

  resp.finally(() => callBack(false))
}

const events: any = {
  text_event: onSendTextEvent,
  image_event: onSendImageEvent,
  image_attach_event: onSendImageAttachEvent,
  video_event: onSendVideoEvent,
  audio_event: onSendAudioEvent,
  file_event: onSendFileEvent,
  input_event: onInputEvent,
  vote_event: onSendVoteEvent,
  sticker_event: onSendStickerEvent,
  mixed_event: onSendMixedEvent
}

const onEditorEvent = (msg: any) => {
  events[msg.event] && events[msg.event](msg)
}

onMounted(() => {
  editorStore.loadUserSticker()
})
</script>

<template>
  <!--  <multi-select-footer v-if="dialogueStore.isOpenMultiSelect" />-->
  <!--  <editor-->
  <!--    v-else-->
  <editor
    :members="members"
    :vote="dialog_type == 2"
    @editor-event="onEditorEvent"
  />
</template>

<style lang="scss" scoped></style>
