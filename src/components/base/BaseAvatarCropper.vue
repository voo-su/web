<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { uploadAvatarApi } from '@/api/upload'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close', 'success'])

const { t } = useI18n()
const state = reactive<any>({
  show: true,
  src: ''
})
const dialogRef = ref<any>()

const cropper = ref<any>('cropper')

const option = reactive<any>({
  img: '',
  size: 1,
  full: false,
  outputType: 'png',
  canMove: true,
  fixedBox: true,
  original: false,
  canMoveBox: true,
  autoCrop: true,
  autoCropWidth: 250,
  autoCropHeight: 250,
  centerBox: false,
  high: true,
  preview: ''
})

const onCloseClick = () => emit('close')

const onTriggerUpload = () => document.getElementById('upload-avatar').click()

const onUpload = (e: any) => {
  let file = e.target.files[0]
  let reader = new FileReader()
  reader.onload = (e: any) => {
    let data
    if (typeof e.target.result === 'object') {
      data = window.URL.createObjectURL(new Blob([e.target.result]))
    } else {
      data = e.target.result
    }
    option.img = data
  }
  reader.readAsArrayBuffer(file)
}

const realTime = () => {
  cropper.value.getCropData((img: any) => {
    option.preview = img
  })
}

const rotateLeft = () => cropper.value.rotateLeft()

const rotateRight = () => cropper.value.rotateRight()

const refreshCrop = () => cropper.value.refresh()

const onSubmit = () => {
  cropper.value.getCropBlob((blob: any) => {
    let file = new File([blob], 'avatar.png', {
      type: blob.type,
      lastModified: Date.now()
    })

    const form = new FormData()
    form.append('file', file)

    uploadAvatarApi(form).then((res: any) => {
      if (res.code == 200) {
        emit('success', res.data.avatar)
      } else {
        ElMessage.info(res.message)
      }
    })
  })
}

const onOpen = async () => {
  const element = dialogRef.value
  if (element) {
    element.dialogContentRef.$refs.headerRef.remove()
  }
}
</script>

<template>
  <input
    id="upload-avatar"
    accept="image/png, image/jpeg, image/jpg,image/webp"
    type="file"
    @change="onUpload"
  >
  <el-dialog
    ref="dialogRef"
    v-model="state.show"
    :before-close="onCloseClick"
    width="690px"
    @open-auto-focus="onOpen"
  >
    <template #default>
      <div class="container">
        <div class="description">
          {{ t('selectedAreaTip') }}
          <br>
          {{ t('rotateImageTip') }}
        </div>
        <div class="content">
          <div class="canvas">
            <vue-cropper
              ref="cropper"
              :auto-crop="option.autoCrop"
              :auto-crop-height="option.autoCropHeight"
              :auto-crop-width="option.autoCropWidth"
              :can-move="option.canMove"
              :can-move-box="option.canMoveBox"
              :center-box="option.centerBox"
              :fixed-box="option.fixedBox"
              :full="option.full"
              :img="option.img"
              :info="true"
              :original="option.original"
              :output-size="option.size"
              :output-type="option.outputType"
              @real-time="realTime"
            />
            <div class="rotate-controls">
              <el-button
                class="rotate left"
                link
                @click="rotateLeft"
              />
              <el-button
                class="rotate right"
                link
                @click="rotateRight"
              />
            </div>
          </div>
          <div class="view">
            <div class="preview">
              <div class="preview-content">
                <img
                  v-show="option.preview"
                  :src="option.preview"
                >
              </div>
            </div>
            <div class="tools">
              <el-button
                v-if="option.preview.length !== 0"
                type="primary"
                @click="onSubmit"
              >
                {{ t('save') }}
              </el-button>
              <el-button
                v-else
                type="primary"
                @click="onTriggerUpload"
              >
                {{ t('selectFile') }}
              </el-button>
              <el-button
                v-if="option.preview.length !== 0"
                link
                type="info"
                @click="onTriggerUpload"
              >
                {{ t('selectFile') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
#upload-avatar {
  display: none;
}

.container {
  height: 380px;
  padding: 15px;

  .description {
    padding: 12px 0 15px;
    font-size: 14px;
    line-height: 150%;
    text-align: center;
    color: #000000;
  }

  .content {
    .canvas {
      width: 300px;
      height: 300px;
      padding: 5px;
      position: absolute;

      .rotate-controls {
        position: absolute;
        right: 8px;
        bottom: 8px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding: 2px;
        background: rgba(0, 0, 0, 0.56);
        border-radius: 4px;

        .rotate {
          width: 28px;
          height: 24px;
          cursor: pointer;
          opacity: .5;
          -webkit-transition: opacity .3s;
          transition: opacity .3s;
          border: 0;
          outline: 0;

          &.left {
            background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cg%20clip-rule%3D%22evenodd%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M9.2%209.5H6.8c-.865%200-1.423.001-1.848.036-.408.033-.559.09-.633.127a1.5%201.5%200%2000-.656.656c-.037.074-.094.225-.127.633-.035.425-.036.983-.036%201.848v.4c0%20.865.001%201.423.036%201.848.033.408.09.559.127.633a1.5%201.5%200%2000.656.655c.074.038.225.095.633.128.425.035.983.036%201.848.036h2.4c.865%200%201.423-.001%201.848-.036.408-.033.559-.09.633-.127a1.5%201.5%200%2000.655-.656c.038-.074.095-.225.128-.633.035-.425.036-.983.036-1.848v-.4c0-.865-.001-1.423-.036-1.848-.033-.408-.09-.559-.128-.633a1.5%201.5%200%2000-.655-.656c-.074-.037-.225-.094-.633-.127C10.623%209.5%2010.065%209.5%209.2%209.5zm-6.873.138C2%2010.28%202%2011.12%202%2012.8v.4c0%201.68%200%202.52.327%203.162a3%203%200%20001.311%201.311C4.28%2018%205.12%2018%206.8%2018h2.4c1.68%200%202.52%200%203.162-.327a3%203%200%20001.311-1.311C14%2015.72%2014%2014.88%2014%2013.2v-.4c0-1.68%200-2.52-.327-3.162a3%203%200%2000-1.311-1.311C11.72%208%2010.88%208%209.2%208H6.8c-1.68%200-2.52%200-3.162.327a3%203%200%2000-1.311%201.311zM13.53%201.97a.75.75%200%20010%201.06l-.72.72H13a4.75%204.75%200%20014.75%204.75V11a.75.75%200%2001-1.5%200V8.5A3.25%203.25%200%200013%205.25h-.19l.72.72a.75.75%200%2001-1.06%201.06l-2-2a.75.75%200%20010-1.06l2-2a.75.75%200%20011.06%200z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) no-repeat center/20px 20px;
          }

          &.right {
            background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cg%20clip-rule%3D%22evenodd%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M13.2%209.5h-2.4c-.865%200-1.423.001-1.848.036-.408.033-.559.09-.633.127a1.5%201.5%200%2000-.656.656c-.037.074-.094.225-.127.633-.035.425-.036.983-.036%201.848v.4c0%20.865.001%201.423.036%201.848.033.408.09.559.127.633a1.5%201.5%200%2000.656.655c.074.038.225.095.633.128.425.035.983.036%201.848.036h2.4c.865%200%201.423-.001%201.848-.036.408-.033.559-.09.633-.127a1.5%201.5%200%2000.655-.656c.038-.074.095-.225.128-.633.035-.425.036-.983.036-1.848v-.4c0-.865-.001-1.423-.036-1.848-.033-.408-.09-.559-.127-.633a1.5%201.5%200%2000-.656-.656c-.074-.037-.225-.094-.633-.127-.425-.035-.983-.036-1.848-.036zm-6.873.138C6%2010.28%206%2011.12%206%2012.8v.4c0%201.68%200%202.52.327%203.162a3%203%200%20001.311%201.311C8.28%2018%209.12%2018%2010.8%2018h2.4c1.68%200%202.52%200%203.162-.327a3%203%200%20001.311-1.311C18%2015.72%2018%2014.88%2018%2013.2v-.4c0-1.68%200-2.52-.327-3.162a3%203%200%2000-1.311-1.311C15.72%208%2014.88%208%2013.2%208h-2.4c-1.68%200-2.52%200-3.162.327a3%203%200%2000-1.311%201.311zM6.47%201.97a.75.75%200%20011.06%200l2%202a.75.75%200%20010%201.06l-2%202a.75.75%200%2001-1.06-1.06l.72-.72H7A3.25%203.25%200%20003.75%208.5V11a.75.75%200%2001-1.5%200V8.5A4.75%204.75%200%20017%203.75h.19l-.72-.72a.75.75%200%20010-1.06z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) no-repeat center/20px 20px;
          }

          &:hover {
            opacity: 1;
          }
        }
      }
    }

    .view {
      margin-left: auto;
      width: 340px;

      .preview {
        padding-top: 30px;
        flex: auto;
        display: flex;
        align-items: center;
        justify-content: center;

        .preview-content {
          width: 180px;
          height: 180px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #f1eaea;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .tools {
        margin-top: 20px;
        width: 100%;

        .el-button {
          margin: 10px 0 0 0;
          width: 100%;
        }
      }
    }
  }
}
</style>
