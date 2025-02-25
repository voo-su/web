import { pushInitApi } from '@/api/account'
import { i18n } from '@/utils/i18n'
import { pushToken, pushTokenSent } from '@/constants/default'

const t = i18n()

const sendPushTokenToServer = (subscriptionObj) => {
  pushInitApi({
    subscription: JSON.stringify(subscriptionObj)
  }).then((res) => {
    console.log('Push token sent to server:', res)
  }).catch(err => {
    console.error('Error sending push token:', err)
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
    if (
      !subscriptionObj ||
      !subscriptionObj.endpoint ||
      !subscriptionObj.keys ||
      !subscriptionObj.keys.p256dh ||
      !subscriptionObj.keys.auth
    ) {
      console.log(t('invalidPushSubscription', { err: subscriptionObj }))
      return
    }

    if (!localStorage.getItem(pushTokenSent) || isTokenChanged(subscriptionObj)) {
      sendPushTokenToServer(subscriptionObj)
      localStorage.setItem(pushTokenSent, 'true')
      localStorage.setItem(pushToken, JSON.stringify(subscriptionObj))
    }
  } else {
    subscribe()
  }
}

const isTokenChanged = (newSubscriptionObj: {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}) => {
  const oldToken = localStorage.getItem(pushToken)
  if (!oldToken) return true

  const oldSubscriptionObj = JSON.parse(oldToken)
  return newSubscriptionObj.endpoint !== oldSubscriptionObj.endpoint ||
    newSubscriptionObj.keys.p256dh !== oldSubscriptionObj.keys.p256dh ||
    newSubscriptionObj.keys.auth !== oldSubscriptionObj.keys.auth
}

const subscribe = () => {
  navigator.serviceWorker.ready
    .then((registration) => registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
    }))
    .then((subscription) => {
      const subscriptionObj: PushSubscriptionJSON = subscription.toJSON()
      sendPushTokenToServer(subscriptionObj)
      localStorage.setItem(pushTokenSent, 'true')
      localStorage.setItem(pushToken, JSON.stringify(subscriptionObj))
    })
    .catch(err => console.error('Error during subscription:', err))
}

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}
