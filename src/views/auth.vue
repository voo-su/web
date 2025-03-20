<script lang="ts" setup>
import { markRaw, onMounted, reactive, ref } from 'vue'
import AuthLogin from '@/components/auth/AuthLogin.vue'
import AuthVerify from '@/components/auth/AuthVerify.vue'
import { CStorage } from '@/utils/storage'
import { AUTH_SESSION_KEY, AUTH_SESSION_TIMER_KEY } from '@/constants/storage'
import { useRouter } from 'vue-router'
import { palyMusic } from '@/utils/chat'
import AppFooter from '../components/app/AppFooter.vue'

const router = useRouter()

const timerExpired = ref<boolean>(false)
const time = ref<number>(0)

interface IState {
  component: any
}

const state = reactive<IState>({
  component: markRaw(AuthLogin)
})

const onVerify = () => {
  time.value = 200
  timerExpired.value = false
  state.component = markRaw(AuthVerify)
}

const onClear = async () => {
  CStorage.deleteItem(AUTH_SESSION_TIMER_KEY)
  CStorage.deleteItem(AUTH_SESSION_KEY)
  time.value = 0
  timerExpired.value = true
}

const onLogin = () => {
  onClear()
  state.component = markRaw(AuthLogin)
}

const onSuccess = async () => {
  await router.push({
    path: '/'
    // query: { redirect: route.query.redirect }
  })
  await onClear()
  await palyMusic(true)
}

const init = () => {
  const timer = CStorage.getItem(AUTH_SESSION_TIMER_KEY)
  if (timer) {
    time.value = Number(CStorage.getItem(AUTH_SESSION_TIMER_KEY))
    state.component = markRaw(AuthVerify)
  }
}

init()

const countdown = () => {
  if (time.value > 0) {
    time.value--
    CStorage.addItem(AUTH_SESSION_TIMER_KEY, time.value.toString())
  } else {
    CStorage.deleteItem(AUTH_SESSION_TIMER_KEY)
    timerExpired.value = true
  }
}

onMounted(() => {
  setInterval(countdown, 1000)
})
</script>

<template>
  <el-container>
    <el-main>
      <div class="auth">
        <component
          :is="state.component"
          :time="time"
          :timer-expired="timerExpired"
          @on-verify="onVerify"
          @on-login="onLogin"
          @on-success="onSuccess"
        />
      </div>
    </el-main>
    <el-footer>
      <app-footer />
    </el-footer>
  </el-container>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/login.scss';
</style>
