<script lang="ts" setup>
import 'xgplayer/dist/index.min.css'
import { nextTick, ref, computed } from 'vue'
import { getImageInfo, type IImageInfo } from '@/utils/functions'
import Player, { I18N } from 'xgplayer'
import { VideoPlay } from '@element-plus/icons-vue'
import type { Data, VideoExtra } from './types'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { locale, messages } = useI18n()

const xgplayer = computed(() => messages.value[locale.value].xgplayer)

I18N.use(xgplayer.value)

const props = defineProps<{
  extra: VideoExtra
  data: Data
  maxWidth: boolean
}>()

const open = ref<boolean>(false)

interface IImg {
  width: string
  height: string
}

const img = (src: string, width: number = 200): IImg | void=> {
  const info: IImageInfo = getImageInfo(src)

  if (info.width == 0 || info.height == 0) {
    return
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

const onPlay = async () => {
  open.value = true
  await nextTick()
  new Player({
    id: 'video-player',
    url: props.extra.url,
    fluid: true,
    autoplay: true,
    lang: 'ru'
  })
}

// :style="img(extra.cover, 350)"
</script>

<template>
  <section
    :class="{ left: data.float === 'left' }"

    class="message-video"
  >
    <div
      v-if="open"
      id="video-player"
      class="message-video-player"
    />
    <div
      v-else
      class="message-video-cover"
    >
      <el-image
        :src="extra.cover"
        fit="cover"
      />
      <el-button
        link
        size="large"
        type="primary"
        @click="onPlay"
      >
        <el-icon>
          <video-play />
        </el-icon>
      </el-button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.message-video {
  position: relative;
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  color: #333;
  background: #F4F4F7;
  border-radius: 0 10px 0 10px;

  &-player {
    width: 300px !important;
    height: 100px !important;
  }

  &-cover {
    overflow: hidden;
    padding: 0;
    border-radius: 5px;
    min-width: 268px;
    min-height: 300px;
    display: flex;
    position: relative;

    .el-image {
      max-width: 300px !important;
      object-fit: contain;
      padding: 0;
      margin: 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }

    .el-button {
      position: absolute;
      left: calc(50% - 30px);
      top: calc(50% - 35px);

      .el-icon {
        color: #8f959e;
        font-size: 50px;
      }
    }
  }
}
</style>
