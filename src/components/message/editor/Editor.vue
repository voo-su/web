<script lang="ts" setup>
import { computed, markRaw, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useDialogStore, useDialogueStore } from '@/store'
import Tribute from 'tributejs'
import 'tributejs/tribute.css'
import {
  Camera,
  Folder as IconFolder,
  Operation as IconOperation,
  Picture as IconPicture,
  Promotion as IconPromotion,
  VideoCamera
} from '@element-plus/icons-vue'
import { emitCall } from '@/utils/common'
import { getDragPasteImg, pasteFilter } from '@/utils/editor'
import { defAvatar } from '@/constants/default'
import EditorImage from './EditorImage.vue'
import EditorSticker from './EditorSticker.vue'
import EditorVote from './EditorVote.vue'
// import EditorRecorder from './EditorRecorder.vue'
import IconAudio from '@/components/icons/IconAudio.vue'
import { getEditorNodeInfo } from './editor'
import { getImageInfo } from '@/utils/functions'
import { uploadImageApi } from '@/api/upload'
import IconEmoticon from '@/components/icons/IconEmoticon.vue'
import { publisher } from '@/utils/publisher'
import IconClip from '@/components/icons/IconClip.vue'
import type { IDropdown } from './types'
import { ElMessage } from 'element-plus'

const props = defineProps({
  vote: {
    type: Boolean,
    default: false
  },
  members: {
    default: () => []
  }
})

const emit = defineEmits(['editor-event'])
const dialogueStore = useDialogueStore()
const dialogStore = useDialogStore()

const editorRef = ref()

const isShowEditorVote = ref<boolean>(false)
// const isShowEditorRecorder = ref(false)

const fileImageAttachRef = ref()
const fileImageRef = ref()
const fileVideoRef = ref()
const fileAudioRef = ref()
const uploadFileRef = ref()

const stickerRef = ref()
const imagePreview = reactive({
  show: false,
  file: null
})

const dropdown = reactive<IDropdown[]>([
  {
    show: true,
    title: 'Прикрепить фото',
    icon: markRaw(Camera),

    click: () => {
      fileImageAttachRef.value.click()
    }
  },
  {
    show: true,
    title: 'Фотография',
    icon: markRaw(IconPicture),

    click: () => {
      fileImageRef.value.click()
    }
  },
  {
    show: true,
    title: 'Видеозапись',
    icon: markRaw(VideoCamera),

    click: () => {
      fileVideoRef.value.click()
    }
  },
  {
    show: true,
    title: 'Аудиозапись',
    icon: markRaw(IconAudio),

    click: () => {
      fileAudioRef.value.click()
    }
  },
  {
    show: true,
    title: 'Файл',
    icon: markRaw(IconFolder),
    click: () => {
      uploadFileRef.value.click()
    }
  },
  {
    show: computed(() => props.vote),
    title: 'Опрос',
    icon: markRaw(IconOperation),
    click: () => {
      isShowEditorVote.value = true
    }
  }
])

const indexName = computed(() => dialogueStore.index_name)

const tribute = new Tribute({
  noMatchTemplate: () => '',
  selectTemplate: (item: any) => {
    return ` <span class="tribute-mention" data-atid="${item.original.id}" contenteditable="false">@${item.original.username}</span>`
  },
  menuItemTemplate: (item: any) => {
    let { avatar } = item.original

    if (avatar == '') {
      avatar = defAvatar
    }

    let name = item.original.username
    // if (item.original.remark) {
    //   name += `(${item.original.remark})`
    // }
    return `
    <img width="18" height="18" src="${avatar}" style="border-radius:50%;">
    <span class="text-ellipsis">${name}</span>`
  },
  requireLeadingSpace: false,
  lookup: 'name',
  values: (_, cb) => {
    let items = !props.members.length ? [] : props.members
    return cb(items)
  }
})

const sendMessage = (e: any, data: any) => {
  if (data.items == undefined || data.items.length == 0) {
    e.target.innerHTML = ''
    return
  }
  switch (data.msgType) {
    case 1:
      if (data.items[0].content.length > 1024) {
        return ElMessage.info('Превышена максимальная длина сообщения. Пожалуйста, разделите его на несколько частей и отправьте отдельно.')
      }

      let event = emitCall('text_event', data, (ok: any) => {
        ok && (e.target.innerHTML = '')
      })
      emit('editor-event', event)
      break
    case 3:
      let detail = getImageInfo(data.items[0].content)
      emit('editor-event',
        emitCall('image_event', {
          ...detail,
          url: data.items[0].content,
          size: 10000
        }, (ok: any) => {
          ok && (e.target.innerHTML = '')
        })
      )
      break
    case 12:
      emit('editor-event',
        emitCall('mixed_event', data, (ok: any) => {
          ok && (e.target.innerHTML = '')
        })
      )
      break
  }
}

const onKeydownEvent = (e: any) => {
  if (e == undefined || e.length == 0) return

  editorRef.value = e

  onInputEvent(e)

  let data = getEditorNodeInfo(document.getElementById('editable'))
  if (e.keyCode == 13 && !data.items) {
    return e.preventDefault()
  }

  let isOk = e.keyCode == 13 && !tribute.isActive && e.shiftKey == false && data.items
  if (isOk) {
    sendMessage(e, data)
    return e.preventDefault()
  }
}

const onButton = () => {
  const e = editorRef.value

  if (e == undefined || e.length == 0) return

  onInputEvent(e)

  let data = getEditorNodeInfo(document.getElementById('editable'))
  if (data.items) {
    sendMessage(e, data)
    return e.preventDefault()
  }
}

const onInputEvent = (e: any) => emit('editor-event',
  emitCall('input_event', e.target.innerHTML.toString(), () => {})
)

const onImageAttachEvent = ({ callBack }: any) => {
  const data = emitCall('image_attach_event', imagePreview.file, (ok: boolean) => {
    callBack(ok)
  })

  emit('editor-event', data)
}

const onVoteEvent = (data: any) => {
  const msg = emitCall('vote_event', data, (ok: boolean) => {
    if (ok) {
      isShowEditorVote.value = false
    }
  })

  emit('editor-event', msg)
}

const editorInsertText = (text: string, img: string) => {
  let editor = document.getElementById('editable')
  let selection = window.getSelection()
  if (selection && editor) {
    editor.focus()

    let range = selection.getRangeAt(0)
    range.deleteContents()

    let textNode: any = document.createTextNode(text)
    if (img.length) {
      textNode = document.createElement('img')
      textNode.src = img
      textNode.className = 'el-emoji'
      textNode.dataset['text'] = text
    }

    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.collapse(true)

    selection.removeAllRanges()
    selection.addRange(range)

    editor.focus()
  }
}

const onStickerEvent = (data: any) => {
  if (data.type == 1) {
    editorInsertText(data.value, data.img)
  } else {
    emit('editor-event',
      emitCall(
        'sticker_event',
        data.value, () => {}
      )
    )
  }

  // stickerRef.value.setShow(false)
}

const insertEditorImage = (file: File) => {
  let imageNode:any = document.createElement('img')
  imageNode.className = 'message-input-image'

  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    let editor = document.getElementById('editable')
    let selection = window.getSelection()
    if (selection && editor) {

      editor.focus()

      let range = selection.getRangeAt(0)
      range.deleteContents()

      imageNode.src = reader.result

      range.insertNode(imageNode)
      range.setStartAfter(imageNode)
      range.collapse(true)

      selection.removeAllRanges()
      selection.addRange(range)

      editor.focus()
    }
  }

  const form = new FormData()
  form.append('file', file)
  uploadImageApi(form)
    .then((res: any) => {
      const {
        code,
        data,
        message
      } = res

      if (code == 200) {
        imageNode.src = data.src
      } else {
        imageNode.remove()
        ElMessage.error(message)
      }
    })
}

const isSupportedImageFormat = (fileName: string) => /\.(gif|jpg|jpeg|png|webp|svg)$/i.test(fileName)

const onUploadImageAttachFile = (e: any) => {
  const file = e.target.files[0]
  e.target.value = null

  if (file && isSupportedImageFormat(file.name)) {
    return insertEditorImage(file)
  }

  ElMessage.info('Поддерживаются только форматы: gif, jpg, jpeg, png, webp, svg.')
}

const onUploadImageChange = (e: any) => {
  const file = e.target.files[0]

  if (file && isSupportedImageFormat(file.name)) {
    openImagePreview(file)
    e.target.value = null
  } else {
    ElMessage.info('Поддерживаются только форматы: gif, jpg, jpeg, png, webp, svg.')
  }
}


const onUploadVideoFile = (e: any) => {
  const file = e.target.files[0]
  e.target.value = null

  const supportedFormats = /\.(mp4|avi|mov|mkv)$/i

  if (file && supportedFormats.test(file.name) && file.type.startsWith('video/')) {
    const fn = emitCall('video_event', file, () => {
    })

    emit('editor-event', fn)

    return
  }

  ElMessage.info('Поддерживаются только форматы: mp4, avi, mov, mkv')
}

const onUploadAudioFile = (e: any) => {
  const file = e.target.files[0]
  e.target.value = null

  const supportedFormats = /\.(mp3|wav|aac|flac|ogg)$/i

  if (file && supportedFormats.test(file.name) && file.type.startsWith('audio/')) {
    const fn = emitCall('audio_event', file, () => {
    })

    emit('editor-event', fn)

    return
  }

  ElMessage.info('Поддерживаются только форматы: mp3, wav, aac, flac, ogg')
}

const onUploadFile = (e: any) => {
  let file = e.target.files[0]
  e.target.value = null
  // if (/\.(pdf|docx|xlsx|zip|txt|PDF|DOCX|XLSX|ZIP|TXT)$/.test(file.name)) {
  let fn = emitCall('file_event', file, () => {
  })

  emit('editor-event', fn)
  // return
  // }

  // return ElMessage.info('Поддерживаются только форматы: pdf, docx, xlsx, zip, txt')
}

// const onRecorderEvent = (file: any) => {
//   emit('editor-event', emitCall('file_event', file))
//   isShowEditorRecorder.value = false
// }


const openImagePreview = (file: any) => {
  imagePreview.file = file
  imagePreview.show = true
}

const closeImagePreview = () => {
  imagePreview.file = null
  imagePreview.show = false
}

const onPaste = (e: any) => {
  pasteFilter(e)
  // try {
  //   async () => {
  //     const clipboardItems = await navigator.clipboard.read()
  //     for (const clipboardItem of clipboardItems) {
  //       for (const type of clipboardItem.types) {
  //         const blob = await clipboardItem.getType(type)
  //
  //         if (blob.type == 'text/plain' || blob.type == 'text/html') {
  //           console.log(await blob.text())
  //         } else {
  //           console.log(blob)
  //         }
  //       }
  //     }
  //   }
  // } catch (err) {
  //   console.error(err)
  // }

  // return e.preventDefault()
}

const onDragPaste = (e: any) => {
  let files = getDragPasteImg(e)
  if (files.length == 0) return
  for (const file of files) {
    insertEditorImage(file)
  }

  return e.preventDefault()
}

const loadEditorDraftText = () => {
  const editor = document.getElementById('editable')
  if (!editor) return

  const dialog: any = dialogStore.findItem(dialogueStore.index_name)
  if (dialog) {
    editor.innerHTML = dialog.draft_text
  }

  editor.focus()

  let selection = window.getSelection()
  if (selection) {
    let range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)

    selection.removeAllRanges()
    selection.addRange(range)
  }
}

const onSubscribeQuote = (data: any) => {
  const {
    id,
    title,
    description,
    image
  } = data

  const editor = document.getElementById('editable')
  const selection = window.getSelection()

  if (selection && editor) {
    editor.focus()

    let range = selection.getRangeAt(0)
    range.deleteContents()

    // Создание блока цитаты
    const quoteCard = document.createElement('div')
    quoteCard.classList.add('quote-card')

    // Установка data-атрибутов цитаты
    quoteCard.dataset.id = id
    quoteCard.dataset.title = title
    quoteCard.dataset.description = description
    quoteCard.dataset.image = image

    // Отключаем редактирование цитаты
    quoteCard.setAttribute('contenteditable', 'false')

    // Создание контента для цитаты
    const quoteCardContent = document.createElement('span')
    quoteCardContent.classList.add('quote-card-content')

    // Заголовок цитаты
    const quoteCardTitle = document.createElement('span')
    quoteCardTitle.classList.add('quote-card-title')
    quoteCardTitle.textContent = title
    quoteCardContent.appendChild(quoteCardTitle)

    // Если изображения нет, добавляем описание
    if (image.length === 0) {
      const quoteCardMeta = document.createElement('span')
      quoteCardMeta.classList.add('quote-card-meta')
      quoteCardMeta.textContent = description
      quoteCardContent.appendChild(quoteCardMeta)
    } else {
      // Добавляем изображение, если оно есть
      const iconImg = document.createElement('img')
      iconImg.setAttribute('src', image)
      iconImg.classList.add('quote-card-image')
      quoteCardContent.appendChild(iconImg)
    }

    quoteCard.appendChild(quoteCardContent)

    // Вставляем цитату на место курсора
    try {
      range.insertNode(quoteCard)

      // Создание пустого текстового узла после цитаты, чтобы пользователь мог продолжить ввод текста
      const textNode = document.createTextNode('\u00A0') // это неразрывный пробел
      range.setStartAfter(quoteCard)
      range.insertNode(textNode)
      range.setStartAfter(textNode)
      range.collapse(true)
    } catch (error) {
      console.error('Не удалось вставить:', error)
    }

    // Снимаем выделение и устанавливаем новое после вставки
    selection.removeAllRanges()
    selection.addRange(range)
    editor.focus()
  }
}

const onRecorderStart = () => {

}

const onRecorderStop = () => {

}

watch(indexName, loadEditorDraftText, { immediate: true })

onMounted(() => {
  const editor = document.getElementById('editable')
  if (editor) {
    tribute.attach(editor)
  }

  loadEditorDraftText()

  publisher.subscribe('editor:quote', onSubscribeQuote)
})

onUnmounted(() => {
  publisher.unsubscribe('editor:quote', onSubscribeQuote)
})
</script>

<template>
  <el-footer class="footer-body">
    <div class="message-column-compose">
      <div class="message-compose">
        <div class="option-btn-left">
          <el-dropdown>
            <span title="Вложение">
              <el-icon :size="20">
                <icon-clip />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template
                  v-for="(item, index) in dropdown"
                  :key="index"
                >
                  <el-dropdown-item
                    v-if="item.show"
                    :icon="item.icon"
                    @click="item.click"
                  >
                    {{ item.title }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="message-input-text">
          <div
            id="editable"
            v-drag="onDragPaste"
            v-paste="onPaste"
            class="editable"
            contenteditable="true"
            placeholder="Написать сообщение..."
            spellcheck="true"
            @keydown="onKeydownEvent($event)"
          />
          <form
            enctype="multipart/form-data"
            style="display: none"
          >
            <input
              ref="fileImageAttachRef"
              accept="image/*"
              type="file"
              @change="onUploadImageAttachFile"
            >
            <input
              ref="fileImageRef"
              accept="image/*"
              type="file"
              @change="onUploadImageChange"
            >
            <input
              ref="fileVideoRef"
              accept="video/*"
              type="file"
              @change="onUploadVideoFile"
            >
            <input
              ref="fileAudioRef"
              accept="audio/*"
              type="file"
              @change="onUploadAudioFile"
            >
            <input
              ref="uploadFileRef"
              type="file"
              @change="onUploadFile"
            >
          </form>
        </div>
        <div class="option-btn-right">
          <el-popover
            ref="stickerRef"
            :width="400"
            placement="top-start"
          >
            <template #reference>
              <div
                class="el-button el-button--info is-link"
                title="Эмодзи"
              >
                <el-icon :size="23">
                  <icon-emoticon />
                </el-icon>
              </div>
            </template>
            <editor-sticker @on-select="onStickerEvent" />
          </el-popover>
        </div>
      </div>
      <div class="record">
        <!--<el-button-->
        <!--  bg-->
        <!--  text-->
        <!--  type="info"-->
        <!--  @click="isShowEditorRecorder = true"-->
        <!--  <el-icon :size="23">-->
        <!--    <component :is="Microphone" />-->
        <!--  </el-icon>-->
        <!--</el-button>-->
        <el-button
          bg
          text
          type="info"
          @click="onButton"
        >
          <el-icon :size="23">
            <component :is="IconPromotion" />
          </el-icon>
        </el-button>
      </div>
    </div>
  </el-footer>
  <editor-image
    v-if="imagePreview.show"
    :file="imagePreview.file"
    @close="closeImagePreview"
    @submit="onImageAttachEvent"
  />
  <editor-vote
    v-if="isShowEditorVote"
    @close="isShowEditorVote = false"
    @submit="onVoteEvent"
  />
  <!--  <editor-recorder-->
  <!--    v-if="isShowEditorRecorder"-->
  <!--    @close="isShowEditorRecorder = false"-->
  <!--    @on-submit="onRecorderEvent"-->
  <!--  />-->
</template>

<style lang="scss" scoped>
.footer-body {
  min-height: 46px;
  border: 0;
  resize: none;
  padding: 10px;
  width: 100%;
  height: auto;
  border-top: 1px solid var(--el-border-color);
}

.message-column-compose {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  .record {
    margin: 0.3rem 0 0 0.5rem;
    flex-shrink: 0;
    height: 3.5rem;
    align-self: flex-end;

    .el-button {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      box-shadow: 0 1px 2px rgb(114, 114, 114, 0.251);
      background-color: #f0f0f0;

      .el-icon {
        font-size: 23px;
      }
    }
  }
}

.message-compose {
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 15px;
  //box-shadow: 0 1px 2px rgb(114, 114, 114, 0.251);

  .message-input-text {
    position: relative;
    flex-grow: 1;
  }

  .option-btn-left, .option-btn-right {
    position: relative;
    display: flex;
    align-items: center;
    right: auto;
    left: auto;
    flex-shrink: 0;
    height: 3.5rem;
    align-self: flex-end;


    .el-button {
      padding: 0 5px;
      width: 30px;
      height: 30px;
    }

    .el-icon {
      color: #8C8C8C
    }
  }

  .option-btn-left {
    margin-left: 15px;

    .el-dropdown {
      cursor: pointer;
    }
  }

  .option-btn-right {
    margin-right: 15px;
  }
}

.editable {
  color: #606266;
  padding: 15px 10px;
  overflow: hidden;
  height: auto;
  line-height: 1.375;
  font-family: "Roboto", sans-serif;
  unicode-bidi: plaintext;
  text-align: initial;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0) !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.editable[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #464545;
  font-size: 12px;
  font-weight: 400;
}

.editable[contenteditable]:focus {
  content: none;
}

:global(.tribute-mention) {
  color: #518afe;
  padding: 0 2px;
}

:global(.message-input-image) {
  width: 60px;
  height: 60px;
  object-fit: cover;
}
</style>
