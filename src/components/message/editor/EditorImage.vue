<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { onMounted, reactive } from 'vue'
import { emitCall } from '@/utils/common'
import { Upload } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  file: {
    type: File,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

interface IState {
  show: boolean
  src: string
  size: string
  loading: boolean
}

const { t } = useI18n()
const state = reactive<IState>({
  show: true,
  src: '',
  size: '',
  loading: false
})

const onCloseClick = () => {
  emit('close')
}

const onSendClick = () => {
  state.loading = true

  let call = emitCall(null, null, (value: any) => {
    state.loading = false
    value && onCloseClick()
  })

  emit('submit', call)
}

const loadFileSrc = (file: any) => {
  let reader: any = new FileReader()
  state.size = file.size
  reader.onload = () => {
    state.src = reader.result
  }
  reader.readAsDataURL(file)
}

onMounted(() => {
  loadFileSrc(props.file)
})
</script>

<template>
  <el-dialog
    v-model="state.show"
    :before-close="onCloseClick"
    width="25%"
    :style="{'--el-dialog-bg-color': 'transparent'}"
  >
    <div class="preview">
      <img :src="state.src">
    </div>
    <template #footer>
      <el-button
        :loading="state.loading"
        type="primary"
        @click="onSendClick"
      >
        {{ t('send') }}
        <el-icon class="el-icon--right">
          <upload />
        </el-icon>
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-button {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
}

.preview {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
