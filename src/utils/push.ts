import { pushInitApi } from '@/api/account'
import { log, logE } from '@/utils/log'
import { i18n } from '@/utils/i18n'
import { PUSH_TOKEN_EXPIRATION_TIME, PUSH_STORAGE_KEY } from '@/constants/notifications'
import { cookie } from '@/utils/storage/cookie-storage'

const saveSubscriptionData = (data: Record<string, any>) => {
  cookie.set(PUSH_STORAGE_KEY, JSON.stringify(data), PUSH_TOKEN_EXPIRATION_TIME / 1000)
}

const getSubscriptionData = (): Record<string, any> | null => {
  const data = cookie.get(PUSH_STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

const sendPushTokenToServer = (obj: PushSubscriptionJSON) => {
  pushInitApi({
    subscription: JSON.stringify({
      endpoint: obj.endpoint,
      keys: {
        auth: obj.keys.auth,
        p256dh: obj.keys.p256dh
      }
    })
  }).then((res) => {
    console.log('Push token sent to server:', res)
    const subscriptionData = getSubscriptionData() || {}
    subscriptionData.lastSent = Date.now()
    saveSubscriptionData(subscriptionData)
  }).catch(err => {
    logE(`Error sending push token: ${err}`)
  })
}

export const pushInit = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    navigator.serviceWorker.ready
      .then((registration: ServiceWorkerRegistration) => registration.pushManager.getSubscription())
      .then((subscription: PushSubscription) => pushSubscriptionNotify(subscription))
  }
}

const pushSubscriptionNotify = (subscription: PushSubscription) => {
  if (subscription) {
    const subscriptionObj: PushSubscriptionJSON = subscription.toJSON()
    if (!isValidSubscription(subscriptionObj)) {
      log(`${i18n('invalidPushSubscription')} : ${subscriptionObj}`)
      return
    }

    const subscriptionData = getSubscriptionData()
    const lastSent = subscriptionData?.lastSent
    const shouldSend = !lastSent || (Date.now() - lastSent) > PUSH_TOKEN_EXPIRATION_TIME

    if (!subscriptionData || isTokenChanged(subscriptionObj, subscriptionData) || shouldSend) {
      saveSubscriptionData({
        token: subscriptionObj,
        sent: true,
        lastSent: Date.now()
      })
      sendPushTokenToServer(subscriptionObj)
    }
  } else {
    subscribe()
  }
}

const isTokenChanged = (newSubscriptionObj: PushSubscriptionJSON, subscriptionData: Record<string, any>) => {
  const oldSubscriptionObj = subscriptionData?.token
  if (!oldSubscriptionObj) return true

  return newSubscriptionObj.endpoint !== oldSubscriptionObj.endpoint ||
    newSubscriptionObj.keys.p256dh !== oldSubscriptionObj.keys.p256dh ||
    newSubscriptionObj.keys.auth !== oldSubscriptionObj.keys.auth
}

const isValidSubscription = (subscriptionObj: PushSubscriptionJSON) => {
  return subscriptionObj && subscriptionObj.endpoint && subscriptionObj.keys &&
    subscriptionObj.keys.p256dh && subscriptionObj.keys.auth
}

const subscribe = () => {
  navigator.serviceWorker.ready
    .then((registration) => registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
    }))
    .then((subscription) => {
      const subscriptionObj: PushSubscriptionJSON = subscription.toJSON()
      saveSubscriptionData({
        token: subscriptionObj,
        sent: true,
        lastSent: Date.now()
      })
      sendPushTokenToServer(subscriptionObj)
    })
    .catch(err => logE(`Error during subscription: ${err}`))
}

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)

  return new Uint8Array(Array.from(rawData).map((char) => char.charCodeAt(0)))
}
