<script lang="ts" setup>
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink } from '@/utils/strings'
import type { IData, IMixedExtra } from './types'
import { getImageInfo } from '@/utils/functions'

const props = defineProps<{
  extra: IMixedExtra
  data: IData
  maxWidth: Boolean
}>()

const { float } = props.data

const maxWidth = (src: any, width: number = 200) => {
  const info = getImageInfo(src)
  if (info.width == 0) {
    return width
  }
  if (info.width < width) {
    return info.width
  }

  return width
}

const img = (src: any, width: number = 200) => {
  const info = getImageInfo(src)
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
</script>

<template>
  <div
    :class="{
      left: float == 'left',
      right: float == 'right',
      maxwidth: maxWidth,
    }"
    class="text-img-message"
  >
    <pre>
      <template v-for="item in extra.items">
        <template v-if="item.type === 1">
          <span v-html="textReplaceEmoji(textReplaceLink(item.content))" />
        </template>
        <template v-else-if="item.type === 3">
          <div
            :style="img(item.content, 300)"
            class="img"
          >
            <el-image
              :preview-src-list="[item.content]"
              :src="item.content"
            />
          </div>
        </template>
      </template>
    </pre>
  </div>
</template>

<style lang="scss" scoped>
.text-img-message {
  position: relative;
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  color: #333;
  background: #eff0f1;
  border-radius: 0 10px 10px 10px;

  .img {
    display: flex;
    margin: 5px 0;
    border-radius: 8px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  &.right {
    border-radius: 10px 0 10px 10px;
  }

  &.maxwidth {
    max-width: 70%;
  }

  pre {
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 3px 5px;
    line-height: 25px;

    :deep(a) {
      color: #0a0404;
      text-decoration: revert;
    }
  }
}
</style>
