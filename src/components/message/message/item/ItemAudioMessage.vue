<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { VideoPause, VideoPlay } from '@element-plus/icons-vue'
import { useAVWaveform } from 'vue-audio-visual'

const props = defineProps({
  extra: Object,
  data: Object
})

const audioRef = ref<any>(null)
const canvas = ref<any>(null)
const durationDesc = ref<any>(null)

const state = reactive({
  isAudioPlay: false,
  duration: 0,
  currentTime: 0
})

useAVWaveform(audioRef, canvas, {
  src: props.extra.url,
  canvHeight: 35,
  canvWidth: 205,
  playtime: false,
  noplayedLineColor: '#8f959e',
  playedLineColor: '#2F80ED',
  playtimeSliderColor: '#2F80ED'
})

const formatTime = (value = 0) => {
  const minutes = parseInt(value / 60)
  const seconds = parseInt(value - minutes * 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const onPlay = () => {
  if (state.isAudioPlay) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }

  state.isAudioPlay = !state.isAudioPlay
}

const onPlayEnd = () => {
  state.isAudioPlay = false
}

const onCanplay = () => {
  state.duration = audioRef.value.duration
  durationDesc.value = formatTime(parseInt(audioRef.value.duration))
}

const onError = (e: any) => {
  console.log('проблемы с воспроизведением аудио', e)
}

const onTimeUpdate = () => {
  let audio = audioRef.value
  if (audio.duration != 0) {
    state.currentTime = audio.currentTime
  }
}
</script>

<template>
  <div class="audio-message">
    <audio
      ref="audioRef"
      preload="auto"
      type="audio/mp3,audio/wav"
      :src="props.extra.url"
      @ended="onPlayEnd"
      @timeupdate="onTimeUpdate"
      @canplay="onCanplay"
      @error="onError"
    />
    <div class="play">
      <div
        class="btn"
        @click.stop="onPlay"
      >
        <el-icon :size="22">
          <component :is="state.isAudioPlay ? VideoPause : VideoPlay" />
        </el-icon>
      </div>
    </div>
    <div class="content">
      <canvas ref="canvas" />
    </div>
    <div class="time">
      {{ formatTime(parseInt(state.currentTime)) }} / {{ durationDesc }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.audio-message {
  display: flex;
  width: 300px;
  height: 45px;
  padding: 0 10px;
  align-items: center;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 10px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .play {
    width: 25px;
    height: inherit;
    flex-shrink: 0;

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .content {
    flex: 1 1;
    height: inherit;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .time {
    width: 64px;
    height: inherit;
    font-size: 10px;
    flex-shrink: 0;
  }
}
</style>
