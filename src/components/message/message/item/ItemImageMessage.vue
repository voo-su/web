<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { Picture as IconPicture } from '@element-plus/icons-vue'
import { getImageInfo, type IImageInfo } from '@/utils/functions'

const props = defineProps({
  extra: Object,
  data: Object
})

const img = (src: any, width: number = 200) => {
  const info: IImageInfo = getImageInfo(src)
  if (info.width == 0 || info.height == 0) {
    return {}
  }

  if (info.width < width) {
    return {
      width: `${info.width}px`,
      height: `${info.height}px`
    }
  }

  return {
    width: `${width}px`,
    height: `${info.height / (info.width / width)}px`,
  }
}

const errorHandler = () => {

}

const srcList = [
  props.extra.url
]
</script>

<template>
  <section
    :class="{ left: props.data.float === 'left' }"
    :style="img(props.extra.url, 250)"
    class="image-message"
  >
    <el-image
      :src="props.extra.url"
      :preview-src-list="srcList"
      @error="errorHandler"
    >
      <template #error>
        <div class="image-slot">
          <el-icon>
            <icon-picture />
          </el-icon>
        </div>
      </template>
    </el-image>
  </section>
</template>

<style lang="scss" scoped>
.image-message {
  overflow: hidden;
  padding: 5px;
  border-radius: 5px;
  background-color: #eff0f1;
  min-width: 60px;
  min-height: 60px;

  :deep(.el-image__preview) {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 30px;
  }
}
</style>
