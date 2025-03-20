import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore, useNotificationStore } from '@/store'
import { applyNotificationAuth } from '@/utils/notification'
import socket from '@/utils/socket'
import { ElMessageBox } from 'element-plus'
import { i18n } from '@/utils/i18n'
import { CStorage } from '@/utils/storage'
import { ACCESS_TOKEN } from '@/constants/storage'

const registerOnceExpireNotice = () => {
  let once = false
  const paths = ['/auth']
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      return
    }

    if (CStorage.exists(ACCESS_TOKEN) || once) {
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
    ElMessageBox.confirm(
      i18n('pleaseLoginAgain'),
      i18n('sessionExpired'),
      {
        confirmButtonText: i18n('login'),
        center: true,
        showCancelButton: false
      }
    )
      .then(() => {
        once = false
        useRouter().push('/auth')
      })
      .catch(() => {})
  })
}

const registerLeaveWebListener = () => {
  document.addEventListener('visibilitychange', () => {
    useNotificationStore().isLeaveWeb = document.visibilityState === 'hidden'
  })
}

const registerNotificationAuth = () => {
  applyNotificationAuth((value: any) => {
    useNotificationStore().isWebNotify = value
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
  const сhatStore = useChatStore()
  const el = document.getElementsByTagName('title')[0]
  const title = el.innerText
  watchEffect(() => {
    setInterval(() => {
      if (сhatStore.getUnreadNum > 0) {
        el.innerText = el.innerText == title ? i18n('newUnreadMessages') : title
      } else {
        el.innerText = title
      }
    }, 1000)
  })
}

const registerConnectListener = () => {
  const notifyStore = useNotificationStore()
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
    if (!paths.includes(pathname) && CStorage.exists(ACCESS_TOKEN)) {
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
