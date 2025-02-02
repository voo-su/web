<script lang="ts" setup>
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink, textReplaceMention } from '@/utils/strings'
import type { IData } from './types'

const props = defineProps<{
  extra: any
  data: IData
  //maxWidth: Boolean
}>()

const { float } = props.data

let textContent = props.data.content

textContent = textReplaceLink(textContent)
textContent = textReplaceMention(textContent, '#3390ec')
textContent = textReplaceEmoji(textContent)
</script>

<template>
  <div
    :class="{
      left: float == 'left',
      right: float == 'right',
      // maxwidth: maxWidth,
    }"
    class="text-message"
  >
    <pre v-html="textContent" />
  </div>
</template>

<style lang="scss" scoped>
.text-message {
  position: relative;
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  color: #333;
  background: #F4F4F7;
  border-radius: 0 10px 10px 10px;

  &.right {
    border-radius: 10px 0 10px 10px;
  }

  &.maxwidth {
    max-width: 70%;
  }

  > pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 3px 5px;
    line-height: 25px;

    :deep(.emoji) {
      vertical-align: text-bottom;
      margin: 0 5px;
    }

    :deep(img[alt='img']) {
      max-width: 300px;
      border-radius: 3px !important;
      display: block;
      cursor: pointer;
    }

    :deep(a) {
      color: #2196f3;
      text-decoration: revert;
    }
  }
}
</style>
