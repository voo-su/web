import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useDialogStore, useNotifyStore } from '@/store'
import { applyNotificationAuth } from '@/utils/notification'
import { isLoggedIn } from '@/utils/auth'
import socket from '@/utils/socket'
import { ElDialog } from 'element-plus'

const registerOnceExpireNotice = () => {
  let once = false
  const paths = ['/auth']
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      return
    }

    if (isLoggedIn() || once) {
      return
    }

    const router = useRouter()
    if (router === undefined) {
      return
    }

    const pathname = router.currentRoute.value.path
    if (paths.includes(pathname)) {
      return
    }

    once = true
    ElDialog.info({
      title: 'Важное сообщение',
      content: 'Текущая сессия недействительна. Пожалуйста, выполните вход снова.',
      positiveText: 'Войти',
      maskClosable: false,
      onPositiveClick: () => {
        once = false
        useRouter().push('/auth')
      }
    })
  })
}

const registerLeaveWebListener = () => {
  document.addEventListener('visibilitychange', () => {
    useNotifyStore().isLeaveWeb = document.visibilityState === 'hidden'
  })
}

const registerNotificationAuth = () => {
  applyNotificationAuth((value: any) => {
    useNotifyStore().isWebNotify = value
  })
}

const registerClickListener = () => {
  const push = (el: any) => {
    const href = el.getAttribute('href')
    if (href) {
      return window.open(href)
    }
  }

  document.body.addEventListener('click', (event: any) => {
    const { target } = event
    if (target.nodeName.toLocaleLowerCase() === 'a') {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        window.event.returnValue = false
      }
      push(target)
    }
  })
}

const registerUnreadListener = () => {
  const useDialog = useDialogStore()
  const el = document.getElementsByTagName('title')[0]
  const title = el.innerText
  watchEffect(() => {
    setInterval(() => {
      if (useDialog.dialogUnreadNum > 0) {
        el.innerText = el.innerText == title ? 'У вас есть непрочитанные сообщения' : title
      } else {
        el.innerText = title
      }
    }, 1000)
  })
}

const registerConnectListener = () => {
  const notifyStore = useNotifyStore()
  const router = useRouter()
  watchEffect(() => {
    if (notifyStore.isLeaveWeb) {
      return
    }

    const pathname = router.currentRoute.value.path
    const paths: string[] = [
      '/auth',
      '/terms'
    ]
    if (!paths.includes(pathname) && isLoggedIn()) {
      !socket.isConnect() && socket.connect()
    }
  })
}

export const listener = () => {
  registerNotificationAuth()
  registerOnceExpireNotice()
  registerLeaveWebListener()
  registerClickListener()
  registerUnreadListener()
  registerConnectListener()
}
