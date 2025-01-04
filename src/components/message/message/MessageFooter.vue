<script lang="ts" setup>
import { onMounted } from 'vue'
import { useDialogStore, useDialogueStore, useNotifyStore, useUploadsStore } from '@/store'
import { useEditorStore } from '@/store/editor'
import socket from '@/utils/socket'
import { messageSendApi, sendVoteApi } from '@/api/message'
import { getVideoImage, throttle } from '@/utils/common'
import Editor from '@/components/message/editor/Editor.vue'
import { uploadApi } from '@/api/upload'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  messageSendApi({
    ...data,
    receiver: {
      receiver_id: props.receiver_id,
      dialog_type: props.dialog_type
    }
  })
    .then(({ code, message }: any) => {
      if (code == 200) {
        callBack(true)
      } else {
        ElMessage.warning(message)
      }
    })
    .catch(() => {
      ElMessage.warning(t('networkOverloaded'))
    })
}

const onSendTextEvent = throttle(({ data, callBack }: any) => {
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

    let el = document.getElementById('chat-session-list')
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

  let cover: any = await uploadApi(coverForm)
  if (cover.code != 200) return

  const form = new FormData()
  form.append('file', data)

  let video: any = await uploadApi(form)
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
    return ElMessage.warning(t('fileSizeLimitExceeded'))
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
    return ElMessage.warning(t('fileSizeLimitExceeded'))
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

const events: any = {
  text_event: onSendTextEvent,
  image_event: onSendImageEvent,
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
  <editor
    :members="members"
    :vote="dialog_type === 2"
    @editor-event="onEditorEvent"
  />
</template>

<style lang="scss" scoped></style>
