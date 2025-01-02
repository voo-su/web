<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { onUnmounted, ref } from 'vue'
import { Close, VideoPlay } from '@element-plus/icons-vue'
import Recorder from 'js-audio-recorder'
import { countDownTime } from '@/utils/functions'

const emit = defineEmits(['close', 'on-submit'])

const isShow = ref<boolean>(true)
const status = ref<number>(0)
const animation = ref<boolean>(false)
const duration = ref<number>(0)
let recorder: any = null

const onCloseClick = () => {
  onDestroy()
  emit('close')
}

const onDestroy = () => {
  if (recorder) {
    recorder.destroy()
  }
}

const onSubmit = () => {
  let blob = recorder.getWAVBlob()
  let file = new File([blob], 'аудиофайл.wav', {
    type: blob.type,
    lastModified: Date.now()
  })
  emit('on-submit', file)
  onDestroy()
}

const onStart = () => {
  recorder = new Recorder()
  recorder.start().then(
    () => {
      animation.value = true
      status.value = 1
    },
    (error: any) => {
      console.log(`${error.name} : ${error.message}`)
    }
  )
  recorder.onprocess = (value: any) => {
    duration.value = parseInt(value)
  }
}

const onStop = () => {
  recorder.stop()
  animation.value = false
  status.value = 2
}

onUnmounted(() => {
  onDestroy()
})
</script>

<template>
  <el-dialog
    v-model="isShow"
    :before-close="onCloseClick"
    title="Запись голоса"
    width="30%"
  >
    <main class="main-box">
      <div class="music">
        <span
          :class="{ 'line-ani': animation }"
          class="line line1"
        />
        <span
          :class="{ 'line-ani': animation }"
          class="line line2"
        />
        <span
          :class="{ 'line-ani': animation }"
          class="line line3"
        />
        <span
          :class="{ 'line-ani': animation }"
          class="line line4"
        />
        <span
          :class="{ 'line-ani': animation }"
          class="line line5"
        />
      </div>
      <div class="tip">
        <p>
          <span v-show="status">
            {{ status == 1 ? 'Запись' : 'Запись приостановлена' }}
          </span>
          {{ countDownTime(duration) }}
        </p>
      </div>
    </main>
    <template #footer>
      <div class="footer">
        <el-button
          v-show="status == 0"
          :icon="VideoPlay"
          type="primary"
          @click="onStart"
        />
        <el-button
          v-show="status == 1"
          :icon="Close"
          type="primary"
          @click="onStop"
        />
        <el-button
          v-show="status == 2"
          type="primary"
          @click="onStart"
        >
          Повторная запись
        </el-button>
        <el-button
          v-show="status == 2"
          type="primary"
          @click="onSubmit"
        >
          Отправить запись
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.main-box {
  height: 300px;
  width: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .tip {
    margin-top: 35px;
    color: rgb(103, 98, 98);
    font-weight: 300;
  }
}

.footer {
  width: 100%;
  text-align: center;

  :deep(.el-button) {
    margin: 0 3px;
  }
}

.music {
  position: relative;
  width: 180px;
  height: 160px;
  border: 8px solid #eae8e8;
  border-bottom: 0px;
  border-top-left-radius: 110px;
  border-top-right-radius: 110px;
}

.music:before,
.music:after {
  content: '';
  position: absolute;
  bottom: -20px;
  width: 40px;
  height: 82px;
  background-color: #eae8e8;
  border-radius: 15px;
}

.music:before {
  right: -25px;
}

.music:after {
  left: -25px;
}

.line {
  position: absolute;
  width: 6px;
  min-height: 30px;
  transition: 0.5s;

  vertical-align: middle;
  bottom: 0 !important;
  box-shadow: inset 0px 0px 16px -2px rgba(0, 0, 0, 0.15);
}

.line-ani {
  animation: equalize 4s 0s infinite;
  animation-timing-function: linear;
}

.line1 {
  left: 30%;
  bottom: 0px;
  animation-delay: -1.9s;
  background-color: #ff5e50;
}

.line2 {
  left: 40%;
  height: 60px;
  bottom: -15px;
  animation-delay: -2.9s;
  background-color: #a64de6;
}

.line3 {
  left: 50%;
  height: 30px;
  bottom: -1.5px;
  animation-delay: -3.9s;
  background-color: #5968dc;
}

.line4 {
  left: 60%;
  height: 65px;
  bottom: -16px;
  animation-delay: -4.9s;
  background-color: #27c8f8;
}

.line5 {
  left: 70%;
  height: 60px;
  bottom: -12px;
  animation-delay: -5.9s;
  background-color: #cc60b5;
}

@keyframes equalize {
  0% {
    height: 48px;
  }

  4% {
    height: 42px;
  }

  8% {
    height: 40px;
  }

  12% {
    height: 30px;
  }

  16% {
    height: 20px;
  }

  20% {
    height: 30px;
  }

  24% {
    height: 40px;
  }

  28% {
    height: 10px;
  }

  32% {
    height: 40px;
  }

  36% {
    height: 48px;
  }

  40% {
    height: 20px;
  }

  44% {
    height: 40px;
  }

  48% {
    height: 48px;
  }

  52% {
    height: 30px;
  }

  56% {
    height: 10px;
  }

  60% {
    height: 30px;
  }

  64% {
    height: 48px;
  }

  68% {
    height: 30px;
  }

  72% {
    height: 48px;
  }

  76% {
    height: 20px;
  }

  80% {
    height: 48px;
  }

  84% {
    height: 38px;
  }

  88% {
    height: 48px;
  }

  92% {
    height: 20px;
  }

  96% {
    height: 48px;
  }

  100% {
    height: 48px;
  }
}
</style>
